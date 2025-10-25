

```javascript
/**
 * Message Buffer for Causal Ordering
 * 
 * Buffers messages until they can be delivered in causal order.
 * Implements the causal delivery protocol.
 */
export class MessageBuffer {
  constructor() {
    this.buffer = [];
    this.delivered = [];
  }

  /**
   * Add a message to the buffer
   * @param {Object} msg - Message object with vectorClock
   */
  addMessage(msg) {
    this.buffer.push(msg);
  }

  /**
   * Check if a message can be delivered based on causal ordering
   * @param {Object} msg - Message to check
   * @param {Array} currentClock - Current vector clock of receiver
   * @returns {boolean} True if message can be delivered
   */
  canDeliver(msg, currentClock) {
    const msgClock = msg.vectorClock;
    
    // Rule 1: Message from sender has exactly next timestamp
    if (msgClock[msg.senderId] !== currentClock[msg.senderId] + 1) {
      return false;
    }
    
    // Rule 2: All other processes have equal or greater timestamps locally
    for (let i = 0; i < msgClock.length; i++) {
      if (i !== msg.senderId && msgClock[i] > currentClock[i]) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get all messages that can be delivered now
   * @param {Array} currentClock - Current vector clock
   * @returns {Array} Array of deliverable messages
   */
  getDeliverableMessages(currentClock) {
    const deliverable = [];
    
    // Filter out deliverable messages from buffer
    this.buffer = this.buffer.filter(msg => {
      if (this.canDeliver(msg, currentClock)) {
        deliverable.push(msg);
        this.delivered.push(msg.id);
        return false; // Remove from buffer
      }
      return true; // Keep in buffer
    });
    
    // Sort by total order (sum of vector clock) for consistent delivery
    return deliverable.sort((a, b) => {
      const sumA = a.vectorClock.reduce((acc, val) => acc + val, 0);
      const sumB = b.vectorClock.reduce((acc, val) => acc + val, 0);
      return sumA - sumB;
    });
  }

  /**
   * Get current buffer size
   * @returns {number} Number of messages waiting
   */
  getBufferSize() {
    return this.buffer.length;
  }

  /**
   * Clear all messages from buffer
   */
  clear() {
    this.buffer = [];
    this.delivered = [];
  }
}
```

---

**Type "next" for FILE 11**
