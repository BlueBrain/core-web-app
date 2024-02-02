import * as Switch from '@radix-ui/react-switch';
import React from 'react';

import styles from './camera-switch.module.css';

interface CameraSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CameraSwitch({ isChecked, onChange }: CameraSwitchProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-row gap-3">
          <Switch.Root
            className={styles.CameraSwitchRoot}
            defaultChecked={isChecked}
            checked={isChecked}
            onCheckedChange={onChange}
          >
            <Switch.Thumb className={styles.CameraSwitchThumb} />
          </Switch.Root>
          <div className="flex flex-col gap-1 text-primary-1">
            <button
              type="button"
              className={`w-full border-none bg-none text-left transition ease-in-out ${
                isChecked ? 'text-neutral-3' : 'text-white'
              }`}
              onClick={() => onChange(false)}
            >
              Overview
            </button>
            <button
              type="button"
              className={`w-full border-none bg-none text-left transition ease-in-out ${
                isChecked ? 'text-white' : 'text-neutral-3'
              }`}
              onClick={() => onChange(true)}
            >
              Movie camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
