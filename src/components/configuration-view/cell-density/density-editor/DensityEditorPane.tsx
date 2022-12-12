import React, { ReactNode } from 'react';
import styles from './density-editor-pane.module.scss';

interface DensityEditorPaneProps {
  children: ReactNode;
}

export default function DensityEditorPane({ children }: DensityEditorPaneProps) {
  return <div className={styles.pane}>{children}</div>;
}
