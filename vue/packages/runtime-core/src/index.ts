/**
 * 判断是否是非null对象
 */
export const isObject = (value: unknown) => {
  return null !== value && 'object' == typeof value
};
