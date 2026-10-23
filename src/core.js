/**
 * Circular buffer with set capacity.
 *
 * When full, writes silently overwrite the oldest element. Reads from the front.
 *
 * Design choices:
 *  - contiguous internal Array, head/tail indices, count to track occupancy.
 *    This avoids resizing the underlying storage on every write.
 *  - once full, new writes overwrite the oldest (FIFO discard). At max capacity,
 *    head and tail advance to the same position, maintaining the FIFO invariant.
 */
export class CircularBuffer {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError("capacity must be a positive integer");
    }
    this._capacity = capacity;
    this._data = new Array(capacity);
    this._head = 0;
    this._count = 0;
  }

  /**
   * @returns {number}
   */
  get capacity() {
    return this._capacity;
  }

  /**
   * Current number of elements.
   * @returns {number}
   */
  get size() {
    return this._count;
  }

  /**
   * @returns {boolean}
   */
  isFull() {
    return this._count === this._capacity;
  }

  /**
   * @returns {boolean}
   */
  isEmpty() {
    return this._count === 0;
  }

  /**
   * Append an item, discarding the oldest if full.
   * @param {*} item
   * @returns {void}
   */
  write(item) {
    if (this._count === this._capacity) {
      // At capacity, head == tail (same physical slot). Writing there
      // advances both pointers, preserving the FIFO discard order.
      this._data[this._head] = item;
      this._head = (this._head + 1) % this._capacity;
      return;
    }
    this._data[(this._head + this._count) % this._capacity] = item;
    this._count++;
  }

  /**
   * Peek at the oldest element without removing it.
   * @returns {*|undefined}
   */
  peek() {
    return this._count === 0 ? undefined : this._data[this._head];
  }

  /**
   * Remove and return the oldest element.
   * @returns {*|undefined}
   */
  read() {
    if (this._count === 0) {
      return undefined;
    }
    const item = this._data[this._head];
    this._data[this._head] = undefined;
    this._head = (this._head + 1) % this._capacity;
    this._count--;
    return item;
  }

  /**
   * Return a shallow array copy, oldest first.
   * @returns {Array}
   */
  toArray() {
    const result = new Array(this._count);
    for (let i = 0; i < this._count; i++) {
      result[i] = this._data[(this._head + i) % this._capacity];
    }
    return result;
  }

  /**
   * Clear the buffer and release references.
   * @returns {void}
   */
  clear() {
    this._data.fill(undefined);
    this._head = 0;
    this._count = 0;
  }
}

/**
 * @param {CircularBuffer} buffer
 * @returns {boolean}
 */
export function isFull(buffer) {
  return buffer.isFull();
}

/**
 * @param {CircularBuffer} buffer
 * @returns {boolean}
 */
export function isEmpty(buffer) {
  return buffer.isEmpty();
}
