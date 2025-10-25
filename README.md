# Real-Time Group Chat with Causal Order Messaging

A distributed systems mini-project demonstrating causal message ordering using vector clocks.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)

## 🎯 Overview

This project implements a real-time group chat system that maintains **causal order** of messages using **vector clocks**. Messages are delivered in an order that respects the happens-before relationship, even when network delays cause out-of-order arrival.

## 🌟 Features

- **Vector Clock Implementation**: Each user maintains a vector clock to track causality
- **Causal Message Ordering**: Messages delivered respecting happens-before relationships
- **Network Simulation**: Configurable delays to simulate real distributed systems
- **Message Buffering**: Intelligent buffering until causal dependencies are met
- **Multi-User Support**: Support for 2-5 concurrent users
- **Real-Time Visualization**: Live vector clock and buffer status display

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/causal-order-chat.git
cd causal-order-chat
npm install
npm start
Open http://localhost:3000 to view it in your browser.
🎓 Learning Objectives
This project demonstrates key distributed systems concepts:
Lamport's Happens-Before Relation
Vector Clocks for Causality Tracking
Causal Message Ordering Algorithms
Message Buffering Strategies
Network Delay and Ordering Challenges
📖 How It Works
Vector Clocks
Each process maintains a vector clock VC[i] where:
VC[i][i] = number of events at process i
VC[i][j] = latest known event count at process j
Causal Ordering Rules
A message M with timestamp VC(M) can be delivered at process i if:
VC(M)[sender] = VC[i][sender] + 1
VC(M)[j] ≤ VC[i][j] for all j ≠ sender
Message Delivery Algorithm
On receiving message M from sender s:
  1. Add M to buffer
  2. While buffer has deliverable messages:
     a. Find message M where causal conditions met
     b. Deliver M to application
     c. Update vector clock: VC[i] = max(VC[i], VC(M))
     d. VC[i][i]++
🧪 Experiments to Try
Concurrent Messages: Switch users rapidly and observe concurrent message handling
Network Delays: Increase delays to see buffering in action
Causal Dependencies: Send A→B→C and observe delivery order
Partition Simulation: Pause one user and observe buffer growth
📁 Project Structure
src/
├── components/       # React UI components
├── utils/           # Vector clock and buffering logic
└── styles/          # CSS styling
🛠️ Built With
React 18
Lucide React (icons)
Tailwind CSS (styling)
📚 Further Reading
Time, Clocks, and the Ordering of Events - Leslie Lamport
Virtual Time and Global States - Mattern
Distributed Systems Concepts
🤝 Contributing
Contributions are welcome! Areas for enhancement:
[ ] Add WebSocket backend for real distributed testing
[ ] Implement partition tolerance simulation
[ ] Add message persistence
[ ] Support for group chat rooms
[ ] Visualization of causality graphs
[ ] Performance metrics dashboard
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Author
Your Name - GitHub
🙏 Acknowledgments
Inspired by Leslie Lamport's work on distributed systems
Based on concepts from distributed computing courses
