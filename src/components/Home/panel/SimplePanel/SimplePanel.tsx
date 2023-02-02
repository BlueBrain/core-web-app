'use client';

import Link from '@/components/Link';
import Styles from './simple-panel.module.css';
// Icons import
import IconPlus from '@/components/icons/Plus';
import ObservatoryIcon from '@/components/icons/ObservatoryIcon';
import BrainFactoryIcon from '@/components/icons/BrainFactoryIcon';
import VirtualLabIcon from '@/components/icons/VirtualLabIcon';

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
  return (
    <Link className={getClassName(className)} href={link}>
      <header>
        {
          title === 'Brain Observatory' ? <ObservatoryIcon /> 
          : title === 'Brain Lab' ? <BrainFactoryIcon />
          : title === 'Brain Simulation' ? <VirtualLabIcon />
          : <IconPlus />
        }
        <div>{title}</div>
      </header>
      <div>{children}</div>
    </Link>
  );
}
