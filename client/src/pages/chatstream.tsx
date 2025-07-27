import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import type { ChannelFilters, ChannelSort } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = import.meta.env.VITE_STREAM_API_KEY!;
console.log('✅ VITE_STREAM_API_KEY:', apiKey); 

const chatClient = StreamChat.getInstance(apiKey);

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const ChatStream = () => {
  const [isReady, setIsReady] = useState(false);
  const currentUserId = localStorage.getItem('userId') || 'guest-user';

  useEffect(() => {
    const connectUser = async () => {
      try {
        const res = await fetch(`${apiBase}/api/stream/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch Stream token');
        }

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
        console.error('❌ Stream connection error:', err);
      }
    };

    connectUser();

    return () => {
      chatClient.disconnectUser();
    };
  }, [currentUserId]);

  if (!isReady) return <div>Loading chat...</div>;

  const filters: ChannelFilters = {
    type: 'messaging',
    members: { $in: [currentUserId] },
  };

  const sort: ChannelSort = {
    last_message_at: -1,
  };

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <div style={{ display: 'flex', height: '100vh' }}>
        <ChannelList filters={filters} sort={sort} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
    </Chat>
  );
};

export default ChatStream;
