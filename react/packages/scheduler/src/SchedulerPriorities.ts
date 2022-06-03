/**
 * 优先级常量
 * @filename: packages/scheduler/src/SchedulerPriorities.ts
 * @author: Mr Prince
 * @date: 2022-06-03 21:00:44
 */

// TODO: Use symbols?
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;

export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;
