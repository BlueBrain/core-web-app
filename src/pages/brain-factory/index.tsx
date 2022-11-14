import * as React from 'react';
import PlaceHolder from '@/components/placeholder';
import Theme from '@/styles/theme.module.css';

export default function BrainFactory() {
  return (
    <PlaceHolder className={Theme.colorPrimary8}>
      <h1>Brain Factory</h1>
    </PlaceHolder>
  );
}
