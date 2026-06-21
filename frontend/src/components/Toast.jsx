import React, { useEffect } from 'react';
import { Paper, Text, Group, ActionIcon } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'error', onClose, duration = 4000, opened }) {
  useEffect(() => {
    if (opened && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [opened, duration, onClose]);

  const typeConfigs = {
    error: {
      color: '#ff4a4a',
      shadow: 'rgba(255, 74, 74, 0.4)',
      prefix: '[ERROR] //',
    },
    success: {
      color: 'var(--neon-bright)',
      shadow: 'rgba(29, 205, 159, 0.4)',
      prefix: '[SUCCESS] //',
    },
    warning: {
      color: '#ffb700',
      shadow: 'rgba(255, 183, 0, 0.4)',
      prefix: '[WARNING] //',
    },
  };

  const config = typeConfigs[type] || typeConfigs.error;

  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            width: '320px',
            pointerEvents: 'auto',
          }}
        >
          <Paper
            p="md"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: `1px solid ${config.color}`,
              boxShadow: `0 0 15px ${config.shadow}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <Group justify="space-between" align="flex-start" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ flex: 1 }}>
                <Text
                  size="xs"
                  style={{
                    color: config.color,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  {config.prefix}
                </Text>
                <Text
                  size="sm"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.4,
                  }}
                >
                  {message}
                </Text>
              </div>

              <ActionIcon
                variant="transparent"
                onClick={onClose}
                size="sm"
                style={{
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  '&:hover': {
                    color: config.color,
                  },
                }}
              >
                [X]
              </ActionIcon>
            </Group>

            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                backgroundColor: config.color,
                boxShadow: `0 0 8px ${config.color}`,
              }}
            />
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
