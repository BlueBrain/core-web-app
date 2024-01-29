import { Button } from 'antd';

import { ButtonProps } from 'antd/lib/button';

import styles from './icon-button.module.scss';

export default function IconButton({ children, ...props }: ButtonProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button type="text" className={styles.iconButton} {...props}>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {children}
    </Button>
  );
}
