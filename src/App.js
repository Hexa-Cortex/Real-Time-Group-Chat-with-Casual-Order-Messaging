
import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Clock, Info } from 'lucide-react';
import { VectorClock } from './utils/VectorClock';
import { MessageBuffer } from './utils/MessageBuffer';
import { USER_NAMES, USER_COLORS, DELAY_OPTIONS, DEFAULT_NUM_USERS } from './utils/constants';

export default function App() {
  const [numUsers, setNumUsers] = useState(DEFAULT_NUM_USERS);
  const [currentUser, setCurrentUser] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageBuffer, setMessageBuffer] = useState(new MessageBuffer());
  const [showInfo, setShowInfo] = useState(false);
  const [deliveryDelay, setDeliveryDelay] = useState(DELAY_OPTIONS.NORMAL);
  
  const vectorClocks = useRef([]);
  const messageCounter = useRef(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    vectorClocks.current = Array.from(
      { length: numUsers },
      (_, i) => new VectorClock(i, numUsers)
    );
  }, [numUsers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const clock = vectorClocks.current[currentUser];
    clock.tick();

    const msg = {
      id: messageCounter.current++,
      senderId: currentUser,
      senderName: USER_NAMES[currentUser],
      text: inputText,
      vectorClock: clock.copy(),
      timestamp: Date.now()
    };

    // Simulate network delay and out-of-order delivery
    const delay = Math.random() * deliveryDelay;
    
    setTimeout(() => {
      messageBuffer.addMessage(msg);
      tryDeliverMessages();
    }, delay);

    setInputText('');
  };

  const tryDeliverMessages = () => {
    const deliverable = messageBuffer.getDeliverableMessages(
      vectorClocks.current[currentUser].clock
    );

    if (deliverable.length > 0) {
      setMessages(prev => [...prev, ...deliverable.map(msg => ({
        ...msg,
        deliveredAt: Date.now()
      }))]);

      deliverable.forEach(msg => {
        if (msg.senderId !== currentUser) {
          vectorClocks.current[currentUser].update(msg.vectorClock);
        }
      });

      // Try again in case more messages are now deliverable
      setTimeout(tryDeliverMessages, 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(tryDeliverMessages, 500);
    return () => clearInterval(interval);
  }, []);

  const formatVectorClock = (clock) => {
    return `[${clock.join(', ')}]`;
  };

  const reset = () => {
    setMessages([]);
    setMessageBuffer(new MessageBuffer());
    vectorClocks.current = Array.from(
      { length: numUsers },
      (_, i) => new VectorClock(i, numUsers)
    );
    messageCounter.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Causal Order Chat System
                </h1>
                <p className="text-sm text-gray-600">
                  Distributed Computing Mini-Project
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Info className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {showInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                How It Works:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Each user maintains a vector clock</li>
                <li>• Messages are delivered in causal order</li>
                <li>• Network delays are simulated randomly</li>
                <li>• Messages wait in buffer until dependencies are met</li>
                <li>• Vector clocks ensure happens-before relationships</li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Users
              </label>
              <select
                value={numUsers}
                onChange={(e) => {
                  setNumUsers(Number(e.target.value));
                  reset();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {[2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} users</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current User
              </label>
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Array.from({ length: numUsers }, (_, i) => (
                  <option key={i} value={i}>{USER_NAMES[i]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Delay (ms)
              </label>
              <select
                value={deliveryDelay}
                onChange={(e) => setDeliveryDelay(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={DELAY_OPTIONS.FAST}>Fast (500ms)</option>
                <option value={DELAY_OPTIONS.NORMAL}>Normal (1s)</option>
                <option value={DELAY_OPTIONS.SLOW}>Slow (2s)</option>
              </select>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reset Chat
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-800">
                Chat Messages (Causally Ordered)
              </h2>
            </div>

            <div className="h-96 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg border-2 ${
                    USER_COLORS[msg.senderId]
                  } ${msg.senderId === currentUser ? 'ml-8' : 'mr-8'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">
                      VC: {formatVectorClock(msg.vectorClock)}
                    </span>
                  </div>
                  <p className="text-gray-800">{msg.text}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Delay: {msg.deliveredAt - msg.timestamp}ms
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message as ${USER_NAMES[currentUser]}...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Vector Clocks</h2>
            <div className="space-y-3">
              {Array.from({ length: numUsers }, (_, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-2 ${
                    i === currentUser
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{USER_NAMES[i]}</span>
                    {i === currentUser && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm text-gray-700">
                    {formatVectorClock(vectorClocks.current[i]?.clock || [])}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Buffer Status
              </h3>
              <div className="text-sm text-gray-600">
                Waiting: {messageBuffer.buffer.length} messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
