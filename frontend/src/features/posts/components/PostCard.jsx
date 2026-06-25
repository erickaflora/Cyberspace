import React, { useState, useEffect } from 'react';
import { Box, Text, Group, Avatar, Badge, UnstyledButton } from '@mantine/core';
import { motion } from 'framer-motion';
import { Pencil, ThumbsUp , MessageSquare, Share2, Trash2, MoreHorizontal } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import Dropdown from '../../../components/Dropdown';

// Mock Data
const DEFAULT_MOCK_POST = {
  id: "node-77x-alpha",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  created_at: "3 hours ago",
  likes_count: 106,
  tags: ["food"],
  owner: {
    username: "runner_v",
    profile_name: "V"
  }
};

// Polygon shape for card edges
const POLYGON_CLIP_PATH = 'polygon(0px 0px, calc(100% - 20px) 0px, 100% 20px, 100% 100%, 20px 100%, 0px calc(100% - 20px))';

export default function PostCard({ 
  post = DEFAULT_MOCK_POST,
  isLiked: isLikedProp,
  onLike,
  onComment,
  onShare,
  onDelete
}) {
  const { user } = useAuthContext();
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync state with incoming props changes
  useEffect(() => {
    setLikes(post.likes_count || 0);
    if (isLikedProp !== undefined) {
      setIsLiked(isLikedProp);
    }
  }, [post.id, post.likes_count, isLikedProp]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(post.id);
    } else {
      // Fallback local toggle logic
      if (isLiked) {
        setLikes(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const owner = post.owner || {};
  const mockUsername = owner.username;
  const mockName = owner.profile_name;
  const timestamp = `${post.created_at}`

  // Identify owner of the post
  const isOwner = user && (user.id === owner.id || user.username === owner.username);

  return (
    <Box
      component={motion.div}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'relative',
        padding: '24px',
        backgroundColor: isHovered ? 'rgba(157, 253, 35, 0.02)' : 'var(--secondary-bg-pure)',
        border: `1px solid ${isHovered ? 'var(--secondary-accent-bright)' : 'var(--secondary-accent-matrix)'}`,
        clipPath: POLYGON_CLIP_PATH,
        boxShadow: isHovered 
          ? `0 0 20px rgba(157, 253, 35, 0.15), inset 0 0 15px rgba(157, 253, 35, 0.05)` 
          : '0 8px 16px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.15s ease-in-out',
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left border highlight */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '25px', 
          left: 0, 
          width: '5px', 
          height: '45px', 
          backgroundColor: isHovered ? 'var(--secondary-accent-bright)' : 'transparent',
          boxShadow: isHovered ? '0 0 12px var(--secondary-accent-bright)' : 'none',
          transition: 'all 0.1s ease'
        }} 
      />

      {/* Top right border notch */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: '40px',
          width: '35px',
          height: '6px',
          backgroundColor: isHovered ? 'var(--secondary-accent-bright)' : 'var(--secondary-accent-matrix)',
          clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)',
          opacity: 0.8,
          transition: 'background-color 0.15s'
        }}
      />

      {/* Profile Info */}
      <Group justify="space-between" align="flex-start" mb="md" wrap="nowrap">
        <Group align="center" gap="md" wrap="nowrap" style={{ overflow: 'hidden', flex: 1 }}>
          <Avatar 
            radius="0" 
            size="md"
            //src= owner profile picture
            style={{ 
              border: `1px solid ${isHovered ? 'var(--secondary-accent-bright)' : 'var(--secondary-accent-matrix)'}`, 
              boxShadow: isHovered ? '0 0 8px var(--secondary-accent-bright)' : 'none',
              flexShrink: 0
            }} 
          />
          <Box style={{ overflow: 'hidden' }}>
            <Group gap="xs" align="baseline" wrap="nowrap">
              <Text size="md" fw={700} c="var(--text-primary)" style={{ tracking: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {mockName}
              </Text>
              <Text size="xs" c="var(--text-dim)" style={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                @{mockUsername}
              </Text>
            </Group>
            <Text size="xs" c="var(--secondary-text-dim)" style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {timestamp}
            </Text>
          </Box>
        </Group>

        {isOwner && (
          <Dropdown
            width={130}
            position="bottom-end"
            target={
              <UnstyledButton 
                className="cyber-card-action"
                style={{ 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '4px'
                }}
                aria-label="Post Options"
              >
                <MoreHorizontal size={18} />
              </UnstyledButton>
            }
            items={[
              {
                label: 'Delete',
                icon: <Trash2 size={14} />,
                onClick: handleDelete,
                color: 'red',
              },
              {
                label: 'Edit',
                icon: <Pencil size={14} />,
              },
            ]}
          />
        )}
      </Group>

      {/* Post Content*/}
      <Text className="text-body" c="var(--text-primary)" mb="lg" style={{ lineHeight: '1.6', wordBreak: 'break-word' }}>
        {post.content}
      </Text>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <Group gap="xs" mb="lg">
          {post.tags.map((tagObj, idx) => {
            const tagText = typeof tagObj === 'string' ? tagObj : tagObj?.name;
            if (!tagText) return null;
            return (
              <Badge
                key={idx}
                radius="0"
                variant="outline"
                className="cyber-badge"
              >
                #{tagText}
              </Badge>
            );
          })}
        </Group>
      )}

      {/* Footer */}
      <Group gap="xl" style={{ fontFamily: 'monospace', fontSize: '11px', borderTop: '1px solid rgba(93, 103, 120, 0.3)', paddingTop: '12px' }}>
        <Group 
          gap="xs" 
          onClick={handleLike} 
          className="cyber-card-action"
          style={{ 
            color: isLiked ? 'var(--secondary-accent-bright)' : undefined 
          }}
        >
          <ThumbsUp 
            size={14} 
            fill={isLiked ? 'var(--secondary-accent-bright)' : 'transparent'} 
            style={{ 
              filter: isLiked ? 'drop-shadow(0 0 4px var(--secondary-accent-bright))' : 'none',
              transition: 'all 0.2s'
            }} 
          />
          <Text size="xs" style={{ fontFamily: 'monospace' }} c={isLiked ? 'white' : 'inherit'}>
            {likes} PREEMS
          </Text>
        </Group>

        <Group 
          gap="xs" 
          className="cyber-card-action"
          onClick={onComment}
        >
          <MessageSquare size={14} />
          <Text size="xs" style={{ fontFamily: 'monospace' }}>0 COMMENTS</Text>
        </Group>

        <Group 
          gap="xs" 
          className="cyber-card-action"
          onClick={onShare}
        >
          <Share2 size={14} />
          <Text size="xs" style={{ fontFamily: 'monospace' }}>DATA_SHARE</Text>
        </Group>
      </Group>
    </Box>
  );
}