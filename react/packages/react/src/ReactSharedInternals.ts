import ReactCurrentDispatcher from './ReactCurrentDispatcher';
import ReactCurrentBatchConfig from './ReactCurrentBatchConfig';
import ReactCurrentActQueue from './ReactCurrentActQueue';
import ReactCurrentOwner from './ReactCurrentOwner';
import ReactDebugCurrentFrame from './ReactDebugCurrentFrame';
import { enableServerContext } from 'shared/ReactFeatureFlags';
import { ContextRegistry } from './ReactServerContextRegistry';

interface Internals {
  ReactCurrentDispatcher: typeof ReactCurrentDispatcher;
  ReactCurrentBatchConfig: typeof ReactCurrentBatchConfig;
  ReactCurrentOwner: typeof ReactCurrentOwner;
  ReactDebugCurrentFrame?: typeof ReactDebugCurrentFrame;
  ReactCurrentActQueue?: typeof ReactCurrentActQueue;
  ContextRegistry?: typeof ContextRegistry;
}

const ReactSharedInternals: Internals = {
  ReactCurrentDispatcher,
  ReactCurrentBatchConfig,
  ReactCurrentOwner,
};

if (__DEV__) {
  ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
}

if (enableServerContext) {
  ReactSharedInternals.ContextRegistry = ContextRegistry;
}

export default ReactSharedInternals;
