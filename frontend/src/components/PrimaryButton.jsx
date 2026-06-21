import React from 'react';
import { Button } from '@mantine/core';

export default function PrimaryButton({ children, ...props }) {
  return (
    <Button
      className="primary-button"
      loaderProps={{ type: 'dots', color: 'var(--bg-pure)' }}
      {...props}
    >
      {children}
    </Button>
  );
}
