export function effect(callback: Function) {
  const effect = new ReactiveEffect(callback);
  effect.run();
  return effect;
}

export let activeEffect: ReactiveEffect = undefined;

class ReactiveEffect {
  /**
   * 激活状态
   */
  active = true;

  /**
   * 回调
   */
  callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
  }

  run() {
    if (this.active) {
      return;
    }
    let prevActiveEffect = activeEffect;
    activeEffect = this;
    try {
      this.callback();
    } finally {
      activeEffect = prevActiveEffect;
    }
  }
}
