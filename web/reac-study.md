# react 源码学习

> 按照流程看的话实在太累了，各种函数跳来跳去的.
> 我决定按照模块来看，每个模块看过去.
> 对整体的流程可能不是特别清楚，
> 但是对于代码的分析可能更简单一点.

## react-dom

1. 创建 ReactDOMRoot
2. 渲染组件

### createRoot

`root`: `FiberRoot`  
`root.current`: `RootFiber`

> `createContainer` 中 `createFiberRoot`  
> `createFiberRoot` 中 `root = new FiberRootNode`  
> `root.current = createHostRootFiber()`  
> `root` 挂载到 `root.current.stateNode`
> `root.current` 初始化 updateQueue (初始化一个空链表?)

> 创建容器(`FiberRootNode`)

`markContainerAsRoot`
> 在真实 DOM 上挂载 `FiberRootNode`

`listenToAllSupportedEvents`
> 监听所有支持的事件

`new ReactDOMRoot(FiberRootNode)`
> 创建 ReactDOMRoot，内部是将 FiberRootNode 放到 `_internalRoot` 属性上

### jsx

> jsx 转换成 createElement
> 这个跟其他内容关系不是非常紧密，但是又是个很大的内容，有空再学吧

### render

1. `updateContainer` 开始往页面上更新内容

## react-reconciler

> 不知道怎么描述

### react-update-queue

更新队列

`initializeUpdateQueue(fiber: Fiber)`  
> 给 `fiber` 初始化更新队列


`cloneUpdateQueue(current: Fiber, workInProgress: Fiber)`
> `workInProgress` 上的更新队列 更改为 `current` 上的更新队列(头结点浅克隆)


`createUpdate(eventTime: number, lane: Lane)`
> 创建一个update,开始时间，优先级


`enqueueUpdate(fiber: Fiber, update: Update, lane: Lane)`
> 加入到更新队列的尾部  
> 需要判断加入的是 `interleaved` 队列 的尾部还是pending队列的尾部  
> 判断条件为:  
> * `fiber.mode` 包含 `ConcurrentMode`，   
> * 且`context`不是`NoContext`   
> * 且 (`workInProgress` 或 `interleaved` 队列存在)    

搞不懂为什么update里面有了优先级了，入队的时候还要加优先级?  

*实锤`lane`其实是个无效的属性, 虽然在`isInterleavedUpdate` 中传入  
但是内部并没有使用,所以`lane`根本没用*

`entangleTransitions`
> 如果`fiber` `lane`




## react-fiber-interleaved-updates

不太懂为什么要这么写一些，貌似没什么用处啊

> interleaved updates 中放了函数组件和类组件的 本次render 的 update 队列
> 每个update中有一个 pending 队列 和 interleaved 队列
> 在这次渲染结束(完成或中断),把interleaved队列 链接到 pending队列末尾

`pushInterleavedQueue`
> 入队

`hasInterleavedUpdates`
> 判断是否有交错队列

`enqueueInterleavedUpdates`
> 如果交错队列存在，添加到更新队列的末尾，并清空交错队列

## react-scheduler

看别人的描述，其实就是 requestIdleCallback 的 polyfill

