import LoginButton from '@/components/LoginButton';
import { basePath } from '@/config';
import theme from '@/styles/theme.module.css';
import styles from './video-panel.module.css';

export type VideoPanelProps = {
  className?: string;
};

function getClassName(className?: string) {
  const classes = [styles.videoPanel, theme.colorPrimary6, "mb-4"];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function VideoPanel({ className }: VideoPanelProps) {
  return (
    <div className={getClassName(className)}>
      <video src={`${basePath}/video/home.mp4`} autoPlay loop muted />
      <section className="relative h-full">
        <h1 className="leading-0.9 m-0 p-0 text-4.5vw uppercase text-blue-4">
          Swiss
          <br />
          Brain
          <br />
          Observatory
        </h1>
        <LoginButton />
      </section>
      <div className={styles.version}>Version {process.env.applicationVersion}</div>
    </div>
  );
}
