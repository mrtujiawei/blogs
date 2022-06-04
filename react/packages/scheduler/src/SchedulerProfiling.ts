/**
 * 调度分析, 貌似就是个打日志的工具
 * @filename: packages/scheduler/src/SchedulerProfiling.ts
 * @author: Mr Prince
 * @date: 2022-06-03 21:02:28
 */
import type { PriorityLevel } from './SchedulerPriorities';
import { enableProfiling } from './SchedulerFeatureFlags';

type Task = {
  id: number;
  priorityLevel: PriorityLevel;
  [key: string]: any;
};

let runIdCounter: number = 0;
let mainThreadIdCounter: number = 0;

// 每个日志大小为 4 bytes
const INITIAL_EVENT_LOG_SIZE = 131072;

// 2M
const MAX_EVENT_LOG_SIZE = 524288;

let eventLogSize = 0;
let eventLogBuffer: ArrayBuffer = null;
let eventLog: Int32Array = null;
let eventLogIndex = 0;

const TaskStartEvent = 1;
const TaskCompleteEvent = 2;
const TaskErrorEvent = 3;
const TaskCancelEvent = 4;
const TaskRunEvent = 5;
const TaskYieldEvent = 6;
const SchedulerSuspendEvent = 7;
const SchedulerResumeEvent = 8;

type EventType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * 输出事件日志
 */
function logEvent(
  entries: [EventType, number, number, (PriorityLevel | number)?]
) {
  if (eventLog !== null) {
    const offset = eventLogIndex;
    eventLogIndex += entries.length;
    if (eventLogIndex + 1 > eventLogSize) {
      eventLogSize *= 2;
      if (eventLogSize > MAX_EVENT_LOG_SIZE) {
        // Using console['error'] to evade Babel and ESLint
        console['error'](
          "Scheduler Profiling: Event log exceeded maximum size. Don't " +
            'forget to call `stopLoggingProfilingEvents()`.'
        );
        stopLoggingProfilingEvents();
        return;
      }
      const newEventLog = new Int32Array(eventLogSize * 4);
      newEventLog.set(eventLog);
      eventLogBuffer = newEventLog.buffer;
      eventLog = newEventLog;
    }
    eventLog.set(entries, offset);
  }
}

/**
 * 开始打日志之前的一些初始化操作
 */
export function startLoggingProfilingEvents(): void {
  eventLogSize = INITIAL_EVENT_LOG_SIZE;
  eventLogBuffer = new ArrayBuffer(eventLogSize * 4);
  eventLog = new Int32Array(eventLogBuffer);
  eventLogIndex = 0;
}

/**
 * 结束打印
 * 重置变量，返回之前打印的所有日志
 */
export function stopLoggingProfilingEvents(): ArrayBuffer | null {
  const buffer = eventLogBuffer;
  eventLogSize = 0;
  eventLogBuffer = null;
  eventLog = null;
  eventLogIndex = 0;
  return buffer;
}

/**
 * 标记任务开始
 */
export function markTaskStart(task: Task, ms: number) {
  if (enableProfiling) {
    logEvent([TaskStartEvent, ms * 1000, task.id, task.priorityLevel]);
  }
}

/**
 * 标记任务结束
 */
export function markTaskCompleted(task: Task, ms: number) {
  if (enableProfiling) {
    logEvent([TaskCompleteEvent, ms * 1000, task.id]);
  }
}

/**
 * 标记任务取消
 */
export function markTaskCanceled(task: Task, ms: number) {
  if (enableProfiling) {
    logEvent([TaskCancelEvent, ms * 1000, task.id]);
  }
}

/**
 * 标记任务错误
 */
export function markTaskErrored(task: Task, ms: number) {
  if (enableProfiling) {
    logEvent([TaskErrorEvent, ms * 1000, task.id]);
  }
}

/**
 * 标记任务运行
 */
export function markTaskRun(task: Task, ms: number) {
  if (enableProfiling) {
    runIdCounter++;
    logEvent([TaskRunEvent, ms * 1000, task.id, runIdCounter]);
  }
}

/**
 * 标记任务暂停
 */
export function markTaskYield(task: Task, ms: number) {
  if (enableProfiling) {
    logEvent([TaskYieldEvent, ms * 1000, task.id, runIdCounter]);
  }
}

/**
 * 标记任务未定暂缓
 */
export function markSchedulerSuspended(ms: number) {
  if (enableProfiling) {
    mainThreadIdCounter++;
    logEvent([SchedulerSuspendEvent, ms * 1000, mainThreadIdCounter]);
  }
}

/**
 * 标记任务启动
 */
export function markSchedulerUnsuspended(ms: number) {
  if (enableProfiling) {
    logEvent([SchedulerResumeEvent, ms * 1000, mainThreadIdCounter]);
  }
}
