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

const apiKey = 'YOUR_STREAM_API_KEY'; // Replace with your real key
const chatClient = StreamChat.getInstance(apiKey);

const ChatPage = () => {
  const [isReady, setIsReady] = useState(false);
  const currentUserId = 'your_user_id_here'; // Replace with dynamic user ID if needed

  useEffect(() => {
    const connectUser = async () => {
      const res = await fetch('http://localhost:3001/api/stream/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const { token } = await res.json();

      await chatClient.connectUser(
        {
          id: currentUserId,
          name: 'Dima', // Optional display name
        },
        token
      );

      setIsReady(true);
    };

    connectUser();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

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

export default ChatPage;
