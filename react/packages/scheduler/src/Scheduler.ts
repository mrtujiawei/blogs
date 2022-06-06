/**
 * 主要实现
 * @filename: packages/scheduler/src/Scheduler.ts
 * @author: Mr Prince
 * @date: 2022-06-04 16:43:04
 */

import {
  enableSchedulerDebugging,
  enableProfiling,
  enableIsInputPending,
  enableIsInputPendingContinuous,
  frameYieldMs,
  continuousYieldMs,
  maxYieldMs,
} from './SchedulerFeatureFlags';

import type { Node } from './SchedulerMinHeap';
import { push, pop, peek } from './SchedulerMinHeap';

import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
} from './SchedulerPriorities';

import {
  markTaskRun,
  markTaskYield,
  markTaskCompleted,
  markTaskCanceled,
  markTaskErrored,
  markSchedulerSuspended,
  markSchedulerUnsuspended,
  markTaskStart,
  stopLoggingProfilingEvents,
  startLoggingProfilingEvents,
} from './SchedulerProfiling';

let getCurrentTime: () => number;

const hasPerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function';

if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}

// setTimeout 最大延时时间，目前大部分应该是 (1 << 31) - 1
// 这里兼容了32位的版本, 范围小1位 (1 << 30) - 1
const maxSigned31BitInt = 1073741823;

// 立即超时
const IMMEDIATE_PRIORITY_TIMEOUT = -1;

// 最终超时时间
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
const NORMAL_PRIORITY_TIMEOUT = 5000;
const LOW_PRIORITY_TIMEOUT = 10000;

// 永远不会超时
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

// 任务队列存储在小顶堆中
const taskQueue = [];
const timerQueue = [];

// 递增任务ID,用来维护插入顺序
let taskIdCounter = 1;

// 暂定调度程序，为了调试
// 是否需要暂停，外部调用
let isSchedulerPaused = false;

let currentTask = null;
let currentPriorityLevel = NormalPriority;

// 执行任务前设置，防止重入
let isPerformingWork = false;

/**
 * 是否已经触发callback调度
 */
let isHostCallbackScheduled = false;

/**
 * 是否已经触发timeout调度
 */
let isHostTimeoutScheduled = false;

// 引用原生的API,防止被polyfill覆盖
const localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
const localClearTimeout =
  typeof clearTimeout === 'function' ? clearTimeout : null;
const localSetImmediate =
  // @ts-ignore
  typeof setImmediate !== 'undefined' ? setImmediate : null; // IE and Node.js + jsdom

// 貌似只是测试的时候用到了
const isInputPending =
  typeof navigator !== 'undefined' &&
  // @ts-ignore
  navigator.scheduling !== undefined &&
  // @ts-ignore
  navigator.scheduling.isInputPending !== undefined
  // @ts-ignore
    ? navigator.scheduling.isInputPending.bind(navigator.scheduling)
    : null;

/**
 * 貌似又是个只在测试中出现的东西
 */
const continuousOptions = { includeContinuous: enableIsInputPendingContinuous };

/**
 * 检查 timerQueue
 * 如果不需要继续延迟
 * 从timeQueue中移除，放入taskQueue中
 */
function advanceTimers(currentTime: number) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // 任务被取消
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 到时间了，转移到 taskQueue 中
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // 还没到时间
      return;
    }
    timer = peek(timerQueue);
  }
}

/**
 * 处理超时
 * 每次只会有一个handleTimeout
 * 每次 `flushWork` 的时候，会取消 hostTimeout
 * `workLoop` 执行完后，如果没有可以执行的task， 会再次添加 hostTimeout
 */
function handleTimeout(currentTime: number) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    // 如果 callback 调度还没开始
    if (peek(taskQueue) !== null) {
      // 可以触发 callback 调度
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      // 触发 timeout 调度
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

/**
 * 执行work
 * 关闭所有schedule, 开始performingWork
 * 触发workLoop
 */
function flushWork(hasTimeRemaining: boolean, initialTime: number) {
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }

  // 关闭回调调度
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // 任务的超时回调不需要了
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      // 生产环境不用catch, 直接让错误打印显示
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      markSchedulerSuspended(currentTime);
    }
  }
}

/**
 * 工作循环
 * 把 task 一个个拿出来执行
 * 直到task 或 时间用尽 、外部暂停
 * @param hasTimeRemaining 是否还有时间剩余
 * @param initialTime 初始时间
 */
function workLoop(hasTimeRemaining: boolean, initialTime: number) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  // 1. 当前有可以执行的任务
  // 2. 并且没有开始schuleduler debug 和 暂定schedule
  // 其中第二点主要是测试的时候会用到
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    // 如果超时时间大于当前时间，说明还没到任务开始执行的时间
    // 或者没有时间剩余，或者系统超时
    // 跳出当前循环
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 任务执行时间还没到，或者没有剩余时间
      break;
    }

    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      if (enableProfiling) {
        markTaskRun(currentTask, currentTime);
      }
      // TODO 看不懂，这里执行回调是干什么
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();

      // 判断任务是否执行结束
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
        if (enableProfiling) {
          markTaskYield(currentTask, currentTime);
        }
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        // 执行结束的任务，从任务队列中移除
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      // 没有 callback， 说明任务已经被取消了
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }

  // 返回是否有额外的工作
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

/**
 * 运行eventHandler, 运行前修改优先级, 运行结束后恢复优先级
 */
function unstable_runWithPriority(priorityLevel: number, eventHandler: Function) {
  // 没有优先级，优先级设置为普通优先级
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  const previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

/**
 * 权限切换
 * 执行handler
 */
function unstable_next(eventHandler: Function) {
  let priorityLevel: number;
  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // 向下切换到普通权限
      priorityLevel = NormalPriority;
      break;
    default:
      // 任何低于普通权限的，保持当前权限
      priorityLevel = currentPriorityLevel;
      break;
  }

  const previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

/**
 * wrap 的时候记录当前的优先级
 * 执行的时候记录执行时候的优先级
 * 用wrap的优先级去执行当前的回调
 * 执行完成后切换回执行前记录的优先级
 */
function unstable_wrapCallback(callback: Function) {
  const parentPriorityLevel = currentPriorityLevel;
  return function () {
    // runWithPriority 的一个分支，为了性能而内联？
    const previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

/**
 * 对外暴露的接口
 * 计算开始执行的时间
 * 插入任务队列中,尝试进行调度
 * @param options 只有 delay 有效，用来延时
 */
function unstable_scheduleCallback(priorityLevel: number, callback: Function, options?: { delay: number }) {
  const currentTime = getCurrentTime();

  let startTime: number;
  if (typeof options === 'object' && options !== null) {
    const delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  let timeout: number;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  // 过期时间
  let expirationTime = startTime + timeout;

  let newTask: Node = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }

  // 延迟执行的任务
  if (startTime > currentTime) {
    // 首先放入timeQueue
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 所有任务都是延迟任务，并且最早插入的任务时最快超时的任务
      if (isHostTimeoutScheduled) {
        // 如果已经设置了超时回调，取消
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // 调度超时任务
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // 如果需要，触发系统回调
    // 如果已经在执行task，则下一次yield的时候再执行
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

/**
 * 暂停执行
 * 不是真的暂停
 * 而是等回调执行完成之后，下一个任务开始之前判断是否要继续执行下一个任务
 */
function unstable_pauseExecution() {
  isSchedulerPaused = true;
}

/**
 * 继续执行任务
 */
function unstable_continueExecution() {
  isSchedulerPaused = false;
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

/**
 * 获取第一个可以执行任务
 */
function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

/**
 * 取消执行任务
 */
function unstable_cancelCallback(task: Node) {
  // 这里貌似根本不会执行啊
  if (enableProfiling) {
    if (task.isQueued) {
      const currentTime = getCurrentTime();
      markTaskCanceled(task, currentTime);
      task.isQueued = false;
    }
  }

  // 设置callback为null
  // 因为用的是小顶堆，移除堆顶以外的节点比较麻烦
  task.callback = null;
}

/**
 * 获取当前优先级
 */
function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

/**
 * 是否消息循环正在运行
 */
let isMessageLoopRunning = false;

/**
 * 系统回调
 */
let scheduledHostCallback = null;

/**
 * 任务timeout ID
 */
let taskTimeoutID: any = -1;

/**
 * 调度程序会定期让出执行权限,防止阻塞其他工作执行，如用户事件
 * 默认情况下，每帧会多次 yield
 * 他不会尝试和帧边界对齐，大多数任务不需要和帧边界对齐
 * 如果需要，建议使用requestAnimationFrame
 */
let frameInterval = frameYieldMs;
const continuousInputInterval = continuousYieldMs;
const maxInterval = maxYieldMs;
let startTime = -1;

let needsPaint = false;

/**
 * 是否需要让出执行权
 * 主要就是判断执行时间有没有超出预设的时间
 */
function shouldYieldToHost(): boolean {
  /**
   * 已经消耗的时间
   */
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // 消耗的时间小于指定的时间，不需要 yield
    return false;
  }

  // 消耗时间超过指定的时间,需要让在执行的代码yield,渲染页面和接受用户输入
  // 如果不需要执行这两个操作,可以在保持响应的同时减少yield
  // 但必须yield，来 `requestPaint` 或其他任务(网络请求)
  if (enableIsInputPending) {
    if (needsPaint) {
      return true;
    }
    if (timeElapsed < continuousInputInterval) {
      // 已经很长时间没有yield
      // 有离散或连续事件触发
      if (isInputPending !== null) {
        return isInputPending();
      }
    } else if (timeElapsed < maxInterval) {
      // 有离散或连续事件触发
      if (isInputPending !== null) {
        return isInputPending(continuousOptions);
      }
    } else {
      // 执行任务太长时间，强制yield
      return true;
    }
  }

  return true;
}

/**
 * 这个其实跟scheduler没啥关系
 * 模拟测试的时候才会用到
 */
function requestPaint() {
  if (
    enableIsInputPending &&
    navigator !== undefined &&
    // @ts-ignore
    navigator.scheduling !== undefined &&
    // @ts-ignore
    navigator.scheduling.isInputPending !== undefined
  ) {
    needsPaint = true;
  }
}

/**
 * 调整 fps 用的
 */
function forceFrameRate(fps: number) {
  if (fps < 0 || fps > 125) {
    console['error'](
      'forceFrameRate takes a positive int between 0 and 125, ' +
        'forcing frame rates higher than 125 fps is not supported'
    );
    return;
  }
  if (fps > 0) {
    frameInterval = Math.floor(1000 / fps);
  } else {
    // 重置fps
    frameInterval = frameYieldMs;
  }
}

/**
 * 没什么好说的，就是获取当前时间
 * 然后执行 `scheduledHostCallback`
 *
 * 比较奇怪的就是 scheduledHostCallback 什么时候赋值的，
 * 执行 scheduledHostCallback 的时候顺便改变?
 */
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();

    // 记录开始时间，方便计算任务执行的时间
    startTime = currentTime;

    // 这个 const 我还是有点无法理解的
    const hasTimeRemaining = true;

    // 如果任务抛出异常，退出当前浏览器任务，方便观察错误
    // 除了 `scheduledHostCallback` 异常
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果还有更多工作，需要在前一个消息时间的末尾安排下一个消息事件
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }

  // 重置 needsPaint 状态
  needsPaint = false;
};

/**
 * 执行任务直到将空闲时间用完
 */
let schedulePerformWorkUntilDeadline: () => void;

// 选择延时执行的方式
if (typeof localSetImmediate === 'function') {
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== 'undefined') {
  // 能用消息通道就用消息通道
  // setTimeout 有 4ms 延迟
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  // 只在非浏览器环境中的回退
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

/**
 * 请求执行回调
 * 如果消息循环未开启，开启消息循环
 */
function requestHostCallback(callback: Function) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    // 如果消息循环未开始，开始消息循环 并执行任务
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}

/**
 * 设置延时任务
 */
function requestHostTimeout(callback: (time: number) => void, ms: number) {
  taskTimeoutID = localSetTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}

/**
 * 取消延时任务
 */
function cancelHostTimeout() {
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}

/**
 * 这东西又是测试用的吧
 */
const unstable_requestPaint = requestPaint;

export {
  ImmediatePriority as unstable_ImmediatePriority,
  UserBlockingPriority as unstable_UserBlockingPriority,
  NormalPriority as unstable_NormalPriority,
  IdlePriority as unstable_IdlePriority,
  LowPriority as unstable_LowPriority,
  unstable_runWithPriority,
  unstable_next,
  unstable_scheduleCallback,
  unstable_cancelCallback,
  unstable_wrapCallback,
  unstable_getCurrentPriorityLevel,
  shouldYieldToHost as unstable_shouldYield,
  unstable_requestPaint,
  unstable_continueExecution,
  unstable_pauseExecution,
  unstable_getFirstCallbackNode,
  getCurrentTime as unstable_now,
  forceFrameRate as unstable_forceFrameRate,
};

/**
 * 这东西也是测试用的
 */
export const unstable_Profiling = enableProfiling
  ? {
      startLoggingProfilingEvents,
      stopLoggingProfilingEvents,
    }
  : null;
