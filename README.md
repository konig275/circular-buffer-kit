# circular-buffer-kit

Circular buffer with a fixed capacity. When full, writes silently overwrite the oldest item.

```js
import { CircularBuffer } from "circular-buffer-kit";

const buf = new CircularBuffer(3);
buf.write("a");
buf.write("b");
buf.write("c");
buf.write("d"); // "a" is discarded
buf.peek();  // "b"
buf.read();  // "b"
buf.toArray(); // ["c", "d"]
```

## Why

Bounded queues need predictable memory. A ring buffer using a fixed array never reallocates during operation, so latency stays constant per write. The trade-off is the loss policy: this library discards the oldest element on overflow rather than rejecting the write or growing storage, which is the right choice when new data matters more than old (logs, metrics, recent-history windows).

## Edge case

`read` and `peek` on an empty buffer return `undefined` rather than throwing. If `undefined` is a legitimate element in your domain, distinguish empty from populated using `isEmpty()` before reading.

## Exports

- `CircularBuffer` — class; default export and named export
- `isFull(buffer)` — module-level helper
- `isEmpty(buffer)` — module-level helper

Run tests with `node --test`.
