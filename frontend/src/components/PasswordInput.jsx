import React from 'react';
import { PasswordInput as MantinePasswordInput } from '@mantine/core';

export default function PasswordInput({ label, ...props }) {
  return (
    <MantinePasswordInput
      label={label}
      styles={{
        label: {
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          textTransform: 'uppercase',
          marginBottom: '4px',
        },
        input: {
          backgroundColor: '#111',
          border: '1px solid var(--neon-matrix)',
          color: 'var(--neon-bright)',
          fontFamily: 'var(--font-mono)',
          '&:focus': {
            borderColor: 'var(--neon-bright)',
            boxShadow: '0 0 10px rgba(29, 205, 159, 0.3)',
          },
        },
        innerInput: {
          fontFamily: 'var(--font-mono)',
          color: 'var(--neon-bright)',
        },
        error: {
          fontFamily: 'var(--font-mono)',
          color: '#ff4a4a',
          fontSize: '11px',
          marginTop: '4px',
        },
      }}
      {...props}
    />
  );
}
