import LoginButton from '@/components/LoginButton';
import { basePath } from '@/config';
import theme from '@/styles/theme.module.css';
import styles from './video-panel.module.css';

export type VideoPanelProps = {
  className?: string;
};

function getClassName(className?: string) {
  const classes = [styles.videoPanel, theme.colorPrimary6];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function VideoPanel({ className }: VideoPanelProps) {
  return (
    <div className={getClassName(className)}>
      <video src={`${basePath}/video/home.mp4`} autoPlay loop muted />
      <section>
        <h1>
          Swiss
          <br />
          Brain
          <br />
          Observatory
        </h1>
        {/* @ts-expect-error Server Component */}
        <LoginButton />
      </section>
    </div>
  );
}
