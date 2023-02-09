'use client';

import Link from '@/components/Link';
// Icons import
import IconPlus from '@/components/icons/Plus';
import ObservatoryIcon from '@/components/icons/ObservatoryIcon';
import BrainFactoryIcon from '@/components/icons/BrainFactoryIcon';
import VirtualLabIcon from '@/components/icons/VirtualLabIcon';
import Styles from './simple-panel.module.css';

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
  let icon;

  switch (title) {
    case 'Brain Observatory':
      icon = <ObservatoryIcon />;
      break;
    case 'Brain Lab':
      icon = <BrainFactoryIcon />;
      break;
    case 'Brain Simulation':
      icon = <VirtualLabIcon />;
      break;
    default:
      icon = <IconPlus />;
  }

  return (
    <Link className={getClassName(className)} href={link}>
      <header>
        {icon}
        <div>{title}</div>
      </header>
      <div>{children}</div>
    </Link>
  );
}
