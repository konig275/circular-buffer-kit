import { test } from "node:test";
import assert from "node:assert/strict";
import { CircularBuffer, isFull, isEmpty } from "../src/index.js";

test("constructor rejects non-positive capacity", () => {
  assert.throws(() => new CircularBuffer(0), RangeError);
  assert.throws(() => new CircularBuffer(-3), RangeError);
});

test("constructor rejects non-integer capacity", () => {
  assert.throws(() => new CircularBuffer(2.5), RangeError);
  assert.throws(() => new CircularBuffer("4"), RangeError);
});

test("fresh buffer is empty and not full", () => {
  const buf = new CircularBuffer(3);
  assert.equal(buf.isEmpty(), true);
  assert.equal(buf.isFull(), false);
  assert.equal(buf.size, 0);
});

test("write and read preserve FIFO order", () => {
  const buf = new CircularBuffer(3);
  buf.write("a");
  buf.write("b");
  buf.write("c");
  assert.equal(buf.read(), "a");
  assert.equal(buf.read(), "b");
  assert.equal(buf.read(), "c");
  assert.equal(buf.isEmpty(), true);
});

test("peek returns oldest without removing", () => {
  const buf = new CircularBuffer(3);
  buf.write("a");
  buf.write("b");
  assert.equal(buf.peek(), "a");
  assert.equal(buf.peek(), "a");
  assert.equal(buf.size, 2);
});

test("read on empty returns undefined", () => {
  const buf = new CircularBuffer(2);
  assert.equal(buf.read(), undefined);
  assert.equal(buf.peek(), undefined);
});

test("writing past capacity discards oldest", () => {
  const buf = new CircularBuffer(3);
  buf.write("a");
  buf.write("b");
  buf.write("c");
  buf.write("d");
  assert.equal(buf.size, 3);
  assert.equal(buf.isFull(), true);
  assert.equal(buf.peek(), "b");
  assert.deepEqual(buf.toArray(), ["b", "c", "d"]);
  assert.equal(buf.read(), "b");
  assert.equal(buf.read(), "c");
  assert.equal(buf.read(), "d");
});

test("interleaved read and write wrap correctly", () => {
  const buf = new CircularBuffer(3);
  buf.write(1);
  buf.write(2);
  assert.equal(buf.read(), 1);
  buf.write(3);
  buf.write(4);
  assert.equal(buf.read(), 2);
  buf.write(5);
  assert.deepEqual(buf.toArray(), [3, 4, 5]);
});

test("full discard sequence maintains FIFO", () => {
  const buf = new CircularBuffer(3);
  for (let i = 1; i <= 5; i++) {
    buf.write(i);
  }
  assert.deepEqual(buf.toArray(), [3, 4, 5]);
});

test("clear resets buffer", () => {
  const buf = new CircularBuffer(3);
  buf.write("a");
  buf.write("b");
  buf.clear();
  assert.equal(buf.isEmpty(), true);
  assert.equal(buf.size, 0);
  assert.equal(buf.capacity, 3);
  assert.equal(buf.peek(), undefined);
});

test("buffer works with one capacity", () => {
  const buf = new CircularBuffer(1);
  assert.equal(buf.isFull(), false);
  buf.write("x");
  assert.equal(buf.isFull(), true);
  assert.equal(buf.peek(), "x");
  buf.write("y");
  assert.equal(buf.size, 1);
  assert.equal(buf.peek(), "y");
  assert.equal(buf.read(), "y");
  assert.equal(buf.isEmpty(), true);
});

test("module-level helpers", () => {
  const buf = new CircularBuffer(2);
  assert.equal(isEmpty(buf), true);
  assert.equal(isFull(buf), false);
  buf.write(1);
  buf.write(2);
  assert.equal(isEmpty(buf), false);
  assert.equal(isFull(buf), true);
});

test("clear on empty buffer is safe", () => {
  const buf = new CircularBuffer(2);
  buf.clear();
  assert.equal(buf.size, 0);
});
