/**
 * 特性状态值
 * @filename: packages/scheduler/src/SchedulerFeatureFlags.ts
 * @author: Mr Prince
 * @date: 2022-06-03 20:39:38
 */

/**
 * 是否开始调试模式
 */
export const enableSchedulerDebugging = false;

/**
 * 是否开输入等待
 */
export const enableIsInputPending = false;

/**
 * 是否开启日志记录
 */
export const enableProfiling = false;
export const enableIsInputPendingContinuous = false;

/**
 * 没帧等待的最长时间
 */
export const frameYieldMs = 5;
export const continuousYieldMs = 50;
export const maxYieldMs = 300;
