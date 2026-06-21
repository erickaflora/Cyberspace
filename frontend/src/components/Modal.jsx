import React from 'react';
import { Paper } from '@mantine/core';

export default function Modal({ children, ...props }) {
  return (
    <Paper
      p="xl"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '1px solid var(--neon-matrix)',
        boxShadow: '0 0 15px rgba(22, 153, 118, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
