import * as Switch from '@radix-ui/react-switch';

import styles from './vertical-switch.module.css';

type VerticalSwitchProps = {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

export default function VerticalSwitch({ isChecked, onChange }: VerticalSwitchProps) {
  return (
    <Switch.Root
      className={styles.SwitchRoot}
      defaultChecked={isChecked}
      checked={isChecked}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className={styles.SwitchThumb} />
    </Switch.Root>
  );
}
