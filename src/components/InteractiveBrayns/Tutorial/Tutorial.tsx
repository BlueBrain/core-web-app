/* eslint-disable no-restricted-syntax */
import { SyntheticEvent, useCallback, useRef, useState } from 'react';

import LeftMouseButtonIcon from '../Icons/LeftMouseButtonIcon';
import MiddleMouseButtonIcon from '../Icons/MiddleMouseButtonIcon';
import RightMouseButtonIcon from '../Icons/RightMouseButtonIcon';
import XIcon from '../Icons/XIcon';
import YIcon from '../Icons/YIcon';
import ZIcon from '../Icons/ZIcon';
import { basePath } from '@/config';
import styles from './tutorial.module.css';

const SUBTITLES: Array<[time: number, content: React.ReactNode]> = [
  [
    0,
    <>
      <div>Zoom</div>
      <MiddleMouseButtonIcon />
    </>,
  ],
  [
    2,
    <>
      <div>Rotate</div>
      <ZIcon />
      <b>+</b>
      <LeftMouseButtonIcon />
    </>,
  ],
  [
    4,
    <>
      <div>Rotate</div>
      <YIcon />
      <b>+</b>
      <LeftMouseButtonIcon />
    </>,
  ],
  [
    6,
    <>
      <div>Rotate</div>
      <XIcon />
      <b>+</b>
      <LeftMouseButtonIcon />
    </>,
  ],
  [
    8,
    <>
      <div>Translate</div>
      <RightMouseButtonIcon />
    </>,
  ],
];
const PLAYBACK_RATE = 0.5;

export default function Tutorial() {
  const refVideoTop = useRef<HTMLVideoElement | null>(null);
  const refVideoBottom = useRef<HTMLVideoElement | null>(null);
  const [subtitle, setSubtitle] = useState<React.ReactNode>('');
  const handleTimeUpdate = useCallback((evt: SyntheticEvent<HTMLVideoElement>) => {
    const video = evt.target as HTMLVideoElement;
    let value: React.ReactNode = '';
    for (const [time, text] of SUBTITLES) {
      if (time > video.currentTime) break;

      value = text;
    }
    setSubtitle(value);
  }, []);

  function handleCanPlay(): void {
    const videoTop = refVideoTop.current;
    const videoBottom = refVideoBottom.current;
    if (!videoTop || !videoBottom) return;

    videoTop.playbackRate = PLAYBACK_RATE;
    videoTop.play();
    videoBottom.playbackRate = PLAYBACK_RATE;
    videoBottom.play();
  }

  return (
    <div className={styles.tutorial}>
      <div className={styles.videoWithSubtitles}>
        <video
          ref={refVideoTop}
          src={`${basePath}/video/brayns/camera-tutorial/top.mp4`}
          muted
          autoPlay
          loop
          onCanPlay={handleCanPlay}
        />
        <div className={styles.subtitles}>{subtitle}</div>
      </div>
      <video
        ref={refVideoBottom}
        src={`${basePath}/video/brayns/camera-tutorial/bottom.mp4`}
        muted
        autoPlay
        loop
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
