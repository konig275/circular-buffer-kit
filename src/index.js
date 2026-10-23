/**
 * Circular buffer with set size; drops oldest item at capacity.
 */
import { CircularBuffer, isFull, isEmpty } from "./core.js";

export { CircularBuffer, isFull, isEmpty };
export default CircularBuffer;
