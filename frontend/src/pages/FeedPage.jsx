import React from 'react';
import { Title, Text } from '@mantine/core';
import { useAuthContext } from '../context/AuthContext';
import PostCard from '../features/posts/components/PostCard';

export default function FeedPage() {
  const { user } = useAuthContext();

  return (
    <>
      <Title
        order={2}
        style={{
          color: 'var(--neon-bright)',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '0 0 8px rgba(29, 205, 159, 0.4)',
          marginBottom: '20px',
        }}
      >
        FEED
      </Title>
      <PostCard />
    </>
  );
}
