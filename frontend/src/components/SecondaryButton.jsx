import React from 'react';
import { Button } from '@mantine/core';

export default function SecondaryButton({ children, ...props }) {
  return (
    <Button
      variant="outline"
      className="secondary-button"
      loaderProps={{ type: 'dots', color: 'var(--neon-bright)' }}
      {...props}
    >
      {children}
    </Button>
  );
}
