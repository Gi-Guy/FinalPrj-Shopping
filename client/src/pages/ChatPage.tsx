import React, { useEffect, useState } from 'react';
import '../scss/chatPage.scss';

interface User {
  id: number;
  username: string;
}

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp?: string;
}

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const myUserId = 1; 

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(res => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    fetch(`http://localhost:3001/api/messages/${myUserId}/${selectedUserId}`)
      .then(res => res.json())
      .then((data: Message[]) => setMessages(data));
  }, [selectedUserId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const res = await fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: myUserId,
        receiverId: selectedUserId,
        content: newMessage
      }),
    });

    const message: Message = await res.json();
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <h3>Users</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <button onClick={() => setSelectedUserId(user.id)}>
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUserId && (
        <div>
          <h3>Chat with {users.find(u => u.id === selectedUserId)?.username}</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid gray', padding: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.senderId === myUserId ? 'right' : 'left' }}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
}
