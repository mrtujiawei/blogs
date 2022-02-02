class Observable {
  constructor(private subscriber: any) {}
  subscribe(observer: any) {
    return this.subscriber(observer);
  }
}
