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


## FiberRootNode

```javascript
/**
 * @param {DocumentElement} containerInfo 根节点
 * @param {number} tag 通过 createRoot 创建的，固定为1
 * @param {boolean} hydrate 
 * @param {string} identifierPrefix 默认为''
 * @param {(...args: any[]) => void} reportError 或者 console.error
 */
function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onRecoverableError) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  this.identifierPrefix = identifierPrefix;
  this.onRecoverableError = onRecoverableError;

  if (enableCache) {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }

  if (supportsHydration) {
    this.mutableSourceEagerHydrationData = null;
  }

  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }

  if (enableTransitionTracing) {
    this.transitionCallbacks = null;
    const transitionLanesMap = (this.transitionLanes = []);
    for (let i = 0; i < TotalLanes; i++) {
      transitionLanesMap.push(null);
    }
  }

  if (enableProfilerTimer && enableProfilerCommitHooks) {
    this.effectDuration = 0;
    this.passiveEffectDuration = 0;
  }

  if (enableUpdaterTracking) {
    this.memoizedUpdaters = new Set();
    const pendingUpdatersLaneMap = (this.pendingUpdatersLaneMap = []);
    for (let i = 0; i < TotalLanes; i++) {
      pendingUpdatersLaneMap.push(new Set());
    }
  }

  if (__DEV__) {
    switch (tag) {
      case ConcurrentRoot:
        this._debugRootType = hydrate ? 'hydrateRoot()' : 'createRoot()';
        break;
      case LegacyRoot:
        this._debugRootType = hydrate ? 'hydrate()' : 'render()';
        break;
    }
  }
}
```

## FiberNode

```javascript
function FiberNode(tag: WorkTag, pendingProps: mixed, key: null | string, mode: TypeOfMode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  if (__DEV__) {
    // This isn't directly used but is handy for debugging internals:

    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;
    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}
```

## ReactElement

```javascript
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```
