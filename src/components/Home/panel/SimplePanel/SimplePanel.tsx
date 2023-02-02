'use client';

import Link from '@/components/Link';
import Styles from './simple-panel.module.css';
// Icons import
import IconPlus from '@/components/icons/Plus';
import ObservatoryIcon from '@/components/icons/ObservatoryIcon';
import BrainFactoryIcon from '@/components/icons/BrainFactoryIcon';
import VirtualLabIcon from '@/components/icons/VirtualLabIcon';
import Icon from '@ant-design/icons/lib/components/Icon';

export type SimplePanelProps = {
  className?: string;
  title: string;
  link: string;
  children: React.ReactNode;
};

function getClassName(className?: string) {
  const classes = [Styles.simplePanel];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function SimplePanel({ className, title, link, children }: SimplePanelProps) {
  const panelIcon = () => {
    if (title === 'Brain Observatory') {
      return <ObservatoryIcon />

    } else if (title === 'Brain Lab') {
      return <BrainFactoryIcon /> 

    } else if (title === 'Brain Simulation') {
      return <VirtualLabIcon />
      
    } else {
      return <IconPlus />
    }
  }
  return (
    <Link className={getClassName(className)} href={link}>
      <header>
        <>
          { panelIcon }
          <div>{title}</div>
        </>
      </header>
      <div>{children}</div>
    </Link>
  );
}
