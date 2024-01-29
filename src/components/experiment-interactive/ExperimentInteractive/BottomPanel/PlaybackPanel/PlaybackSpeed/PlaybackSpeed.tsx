import { Select } from 'antd';

import {
  getAllPlaybackSpeedItems,
  usePlaybackSpeed,
} from '@experiment-interactive/hooks/playback-speed';
import { classNames } from '@/util/utils';

import styles from './playback-speed.module.css';

export default function PlaybackSpeed() {
  const [item, setId] = usePlaybackSpeed();

  return (
    <div
      className={classNames(
        styles.playbackSpeed,
        'flex flex-col flex-0 justify-between items-start'
      )}
    >
      <div className="flex flex-row gap-2">
        <span>Speed: </span>
        <b>1 / {item.factor}</b>
      </div>
      <Select
        style={{ width: 160, color: '#fff' }}
        bordered={false}
        value={item.id}
        onChange={setId}
        options={getAllPlaybackSpeedItems().map((elem) => ({
          value: elem.id,
          label: elem.label,
        }))}
      />
    </div>
  );
}
