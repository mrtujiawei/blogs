# scheduler

主要是对外暴露了一些优先级属性、调度任务的函数、获取调度信息的函数

## 调用顺序

1. unstable_scheduleCallback
2. [requestHostTimeout]
3. requestHostCallback
4. schedulePerformWorkUntilDeadline
5. performWorkUntilDeadline
6. scheduledHostCallback (flushWork)
7. workLoop
8. advanceTimers
9. shouldYieldToHost
10. task.callback
11. callback

## 变量定义

- timerQueue

小顶堆,根据 startTime 排序，
当前时间大于等于startTime时转移到taskQueue中

- taskQueue

小顶堆，根据 expirationTime 排序
当前时间大于等于 expirationTime 且有执行权限后开始执行 task

## 函数定义

### unstable_scheduleCallback

`(priorityLevel: number, callback: Function, options?: { delay: number })`

主要对外暴露的接口

1. 根据传入的 priorityLevel 和 options， 计算 task.startTime task.expirationTime
2. 根据 startTime currentTime 决定 task 加入 timerQueue 或 taskQueue
3. 尝试开始或重新进行任务调度


### requestHostTimeout

`(handleTimeout: (currentTime: number) => void, ms: number) => void`

taskQueue 为空, timerQueue 不为空的情况下触发  
触发时出入的参数分别为 handleTimeout 和 延时 ms

### requestHostCallback

`(flushWork: (hasTimeRemaining: boolean, initialTime: number))`

有 task 可以执行, 可能是新插入的任务，或者定时任务超时  
保存当前需要执行的 flushWork, 如果 messageLoop 没有开始，开始 messageLoop

### flushWork

`(hasTimeRemaining: boolean, initialTime: number) => boolean`

1. 关闭所有调度状态，取消 requestHostTimeout 调度  
等 flushWork 执行完成之后会检查任务，根据情况继续或终止调度
2. 调用 workLoop,返回workLoop执行结果,是否还有任务未执行完成

### workLoop

`(hasTimeRemaining: boolean, initialTime: number) => boolean`

1. 获取 taskQueue 中的第一个任务，检查任务是否需要执行,是否有时间剩余
2. 执行 callback, 获取返回值 continuationCallback
3. 如果 continuationCallback 是函数，说明这个task还没有执行完, task.callback = continuationCallback, 否则将 task 移出 taskQueue, advanceTimers
4. 没有剩余时间或taskQueue为空，结束循环
5. 返回 taskQueue 是否非空, 如果为空， requestHostTimeout

### schedulePerformWorkUntilDeadline

`() => void`

调度执行工作直到超过时间(frameYieldMs)  
调度工作选择顺序  
1. `setImmediate`
2. `MessageChannel`
3. `setTimeout`

### advanceTimers

`(currentTime: number) => void`

检查 timerQueue, task.startTime <= currentTime (超时) 的 task,
移动到 taskQueue 中

### handleTimeout

`(currentTime: number) => void`

如果任务调度没有开始,尝试调度任务

1. requestHostCallback: taskQueue 非空
2. requestHostTimeout: taskQueue 空， timerQueue 非空

### unstable_runWithPriority

`(priorityLevel: number, eventHandler: Function) => ReturnType<eventHandler>`

这个貌似并没有使用

NoPriority => NormalPriority  
使用传入的优先级执行 eventHandler, 返回执行的结果

### unstable_next

`(eventHandler: Function)`

使用更低一级的优先级执行 eventHandler

### unstable_wrapCallback

`(callback: Function) => Function`

调用时记录当前的执行优先级
回调时使用之前记录的优先级执行callback


### unstable_pauseExecution

暂定调度

### unstable_continueExecution

继续调度

### shouldYieldToHost

判断是否需要yield, 超过 frameYieldMs

### forceFrameRate

强行改变fps

### performWorkUntilDeadline

调用 scheduledHostCallback , 实际上是执行 flushWork
根据返回值，确定是否继续调度

