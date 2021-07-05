class Heap {
  constructor(compare) {
    this.A = [];
    this.compare = compare;
  }

  size() {
    return this.A.length;
  }

  left(i) {
    return 2 * i + 1;
  }

  right(i) {
    return 2 * i + 2;
  }

  parent(i) {
    return i > 0 ? (i - 1) >>> 1 : -1;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.A[0];
  }

  heapifyDown(i) {
    let p = i;
    const l = this.left(i),
      r = this.right(i),
      size = this.size();
    if (l < size && this.compare(l, p)) p = l;
    if (r < size && this.compare(r, p)) p = r;
    if (p !== i) {
      this.exchange(i, p);
      this.heapifyDown(p);
    }
  }

  heapifyUp(i) {
    const p = this.parent(i);
    if (p >= 0 && this.compare(i, p)) {
      this.exchange(i, p);
      this.heapifyUp(p);
    }
  }

  exchange(x, y) {
    const temp = this.A[x];
    this.A[x] = this.A[y];
    this.A[y] = temp;
  }

  compare() {
    throw new Error('Must be implement!');
  }
}

class PriorityQueue extends Heap {
  constructor(compare) {
    super(compare);
  }

  enqueue(node) {
    this.A.push(node);
    this.heapifyUp(this.size() - 1);
  }

  dequeue() {
    const first = this.A[0];
    const last = this.A.pop();
    if (first !== last) {
      this.A[0] = last;
      this.heapifyDown(0);
    }
    return first;
  }
} 
