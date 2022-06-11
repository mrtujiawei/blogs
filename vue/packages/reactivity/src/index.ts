import { Logger } from '@mrtujiawei/utils';
import { isObject } from '@vue/shared';

const logger = Logger.getLogger('@vue/reactivity');
logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.subscribe((content) => {
  console.log(content.getFormattedMessage());
});

const reactiveMap = new WeakMap<Object, any>();

function track() {
  logger.trace('track');
}

function trigger() {
  logger.trace('trigger');
}

export function reactivity<T extends Object>(value: T): any {
  if (!isObject(value)) {
    return value;
  }

  if (reactiveMap.has(value)) {
    return reactiveMap.get(value);
  }

  const proxy = new Proxy(value, {
    get(target, key, receiver) {
      track();
      logger.trace(`get ${String(key)}`);
      return reactivity(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
      trigger();
      logger.trace(`set ${String(key)} = ${value}`);
      return Reflect.set(target, key, value, receiver);
    },
  });

  reactiveMap.set(value, proxy);

  return proxy;
}
