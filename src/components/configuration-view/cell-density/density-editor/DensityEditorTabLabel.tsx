import GripDotsVerticalIcon from '@/components/icons/GripDotsVerticalIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

import styles from './density-editor-tab-label.module.scss';

interface DensityEditorTabLabelProps {
  text: string;
}

export default function DensityEditorTabLabel({ text }: DensityEditorTabLabelProps) {
  return (
    <div className={styles.contentTab}>
      <GripDotsVerticalIcon />
      <div className={styles.contentTabLabel}>{text}</div>
      <ChevronDownIcon className="dropdown-menu-icon" />
    </div>
  );
}
