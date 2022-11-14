import LoginButton from '@/components/login-button';
import Theme from '@/styles/theme.module.css';
import Styles from './video-panel.module.css';

const defaultProps = { className: '' };
export type VideoPanelProps = {
  className?: string;
} & typeof defaultProps;

function getClassName(className?: string) {
  const classes = [Styles.videoPanel, Theme.colorPrimary6];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function VideoPanel({ className }: VideoPanelProps) {
  return (
    <div className={getClassName(className)}>
      <video src="video/home.mp4" autoPlay loop muted />
      <section>
        <h1>
          Swiss
          <br />
          Brain
          <br />
          Observatory
        </h1>
        <LoginButton />
      </section>
    </div>
  );
}
VideoPanel.defaultProps = defaultProps;
