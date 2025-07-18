import React, { useEffect, useState } from 'react';
import socket from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (data) => setChat((prev) => [...prev, data]));
    socket.on('user-typing', (user) => setTyping(`${user} is typing...`));
    socket.on('online-users', (users) => setOnlineUsers(users));
  }, []);

  const sendMessage = () => {
    socket.emit('send-message', { sender: username, message });
    setMessage('');
    setTyping('');
  };

  const handleTyping = () => socket.emit('typing', username);

  const joinChat = () => {
    socket.emit('join', username);
  };

  return (
    <div>
      {!username ? (
        <div>
          <input placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
          <button onClick={joinChat}>Join Chat</button>
        </div>
      ) : (
        <div>
          <h2>Online Users: {onlineUsers.join(', ')}</h2>
          <div style={{ border: '1px solid black', padding: 10, height: 300, overflowY: 'scroll' }}>
            {chat.map((msg, i) => (
              <div key={i}><strong>{msg.sender}</strong>: {msg.message} <em>{msg.timestamp}</em></div>
            ))}
          </div>
          <p>{typing}</p>
          <input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
