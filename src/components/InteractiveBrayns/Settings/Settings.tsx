/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Slider } from 'antd';
import LeftMouseButtonIcon from '../Icons/LeftMouseButtonIcon';
import MiddleMouseButtonIcon from '../Icons/MiddleMouseButtonIcon';
import RightMouseButtonIcon from '../Icons/RightMouseButtonIcon';
import Tutorial from '../Tutorial';
import ShiftIcon from '../Icons/ShiftIcon';
import { GizmoIcon } from './GizmoIcon';
import Styles from './settings.module.css';

interface SettingsProps {
  visible: boolean;
  onVisibleChange(visible: boolean): void;
  opacity: number;
  onOpacityChange(opacity: number): void;
}

export default function Settings({
  visible,
  onVisibleChange,
  opacity,
  onOpacityChange,
}: SettingsProps) {
  const opacityId = React.useId();
  return (
    <div className={`${Styles.settings} ${visible ? Styles.show : Styles.hide}`}>
      <div className={Styles.closeButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onClick={() => onVisibleChange(false)}
        >
          <title>window-close</title>
          <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
        </svg>
      </div>
      <main>
        <div className={Styles.opacity}>
          <label htmlFor={opacityId}>
            <div>Opacity:</div>
            <div>{(100 * opacity).toFixed()}%</div>
          </label>
          <div id={opacityId}>
            <Slider min={0} max={1} step={0.1} value={opacity} onChange={onOpacityChange} />
          </div>
        </div>
        <hr />
        <div className={Styles.threeColumns}>
          <LeftMouseButtonIcon />
          <MiddleMouseButtonIcon />
          <RightMouseButtonIcon />
          <div>Rotate</div>
          <div>Zoom</div>
          <div>Translate</div>
        </div>
        <Tutorial />
        <div className={Styles.shiftIcon}>
          <ShiftIcon />
          <p>Hold down Shift to slow down the movement.</p>
        </div>
        <hr />
        <p>Click on the gizmo to select an axis, or reset the view.</p>
        <div className={Styles.center}>
          <GizmoIcon />
        </div>
      </main>
    </div>
  );
}
