/**
 * Vector Clock Implementation for Distributed Systems
 * 
 * A vector clock is a data structure used for determining 
 * the partial ordering of events in a distributed system.
 */
export class VectorClock {
  /**
   * Create a new vector clock
   * @param {number} nodeId - ID of this node/process
   * @param {number} numNodes - Total number of nodes in system
   */
  constructor(nodeId, numNodes) {
    this.nodeId = nodeId;
    this.clock = new Array(numNodes).fill(0);
  }

  /**
   * Increment this node's clock value (on local event)
   */
  tick() {
    this.clock[this.nodeId]++;
  }

  /**
   * Update clock on receiving message (merge with received clock)
   * @param {Array} otherClock - Vector clock from received message
   */
  update(otherClock) {
    for (let i = 0; i < this.clock.length; i++) {
      this.clock[i] = Math.max(this.clock[i], otherClock[i]);
    }
    this.tick();
  }

  /**
   * Create a copy of the current clock state
   * @returns {Array} Copy of clock array
   */
  copy() {
    return [...this.clock];
  }

  /**
   * Check if this clock happens before another clock
   * @param {Array} otherClock - Clock to compare against
   * @returns {boolean} True if this happened before other
   */
  happensBefore(otherClock) {
    let lessOrEqual = true;
    let strictlyLess = false;
    
    for (let i = 0; i < this.clock.length; i++) {
      if (this.clock[i] > otherClock[i]) {
        lessOrEqual = false;
        break;
      }
      if (this.clock[i] < otherClock[i]) {
        strictlyLess = true;
      }
    }
    
    return lessOrEqual && strictlyLess;
  }

  /**
   * Check if this clock is concurrent with another
   * @param {Array} otherClock - Clock to compare against
   * @returns {boolean} True if events are concurrent
   */
  isConcurrent(otherClock) {
    const thisHB = this.happensBefore(otherClock);
    const otherHB = new VectorClock(0, this.clock.length);
    otherHB.clock = otherClock;
    return !thisHB && !otherHB.happensBefore(this.clock);
  }

  /**
   * Format clock as string for display
   * @returns {string} Formatted clock string
   */
  toString() {
    return `[${this.clock.join(', ')}]`;
  }
}
