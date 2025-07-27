import React, { useEffect, useState } from 'react';
import { AppRouter } from './router';

import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css'; 

const apiKey = 'YOUR_STREAM_API_KEY';
const chatClient = StreamChat.getInstance(apiKey);

function App() {
  const [isReady, setIsReady] = useState(false);
  const currentUserId = 'user-id-from-auth'; // You can pull this from context or localStorage

  useEffect(() => {
    async function connectChatUser() {
      try {
        const res = await fetch('http://localhost:3001/api/stream/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId }),
        });

        const { token } = await res.json();

        await chatClient.connectUser(
          {
            id: currentUserId,
            name: 'Dima', 
          },
          token
        );

        setIsReady(true);
      } catch (err) {
        console.error('Failed to connect to Stream Chat:', err);
      }
    }

    connectChatUser();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!isReady) return <div>Loading chat...</div>;

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <AppRouter />
    </Chat>
  );
}

export default App;
