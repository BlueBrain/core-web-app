/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import OptimizedImage from 'next/image';
import { Slider } from 'antd';
import GizmoPNG from './gizmo.png';
import LMB from './LMB.png';
import MMB from './MMB.png';
import RMB from './RMB.png';
import Styles from './settings.module.css';

interface SettingsProps {
  opacity: number;
  onOpacityChange(opacity: number): void;
}

export default function Settings({ opacity, onOpacityChange }: SettingsProps) {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const opacityId = React.useId();
  return (
    <div className={`${Styles.Settings} ${expanded ? Styles.show : Styles.hide}`}>
      <main>
        <div className={Styles.grid}>
          <label htmlFor={opacityId}>Opacity:</label>
          <div id={opacityId}>
            <Slider min={0} max={1} step={0.1} value={opacity} onChange={onOpacityChange} />
          </div>
        </div>
        <hr />
        <div className={Styles.threeColumns}>
          <OptimizedImage src={LMB} alt="Rotate" />
          <OptimizedImage src={MMB} alt="Zoom" />
          <OptimizedImage src={RMB} alt="Translate" />
          <div>Rotate</div>
          <div>Zoom</div>
          <div>Translate</div>
        </div>
        <ul>
          <li>
            Use the <b>mouse wheel</b> to zoom in and out.
          </li>
          <li>
            Left mouse drag to orbit the camera.
            <ul>
              <li>
                Hold <code>Shift</code> to slow down the movement.
              </li>
              <li>
                Hold <code>X</code>, <code>Y</code> or <code>Z</code> to constraint orbiting around
                a fixed axis.
              </li>
            </ul>
          </li>
          <li>
            Right mouse drag to translate the camera.
            <ul>
              <li>
                Hold <code>Shift</code> to slow down the movement.
              </li>
            </ul>
          </li>
        </ul>
        <hr />
        <p>Click on the gizmo to face any axis, or reset the view.</p>
        <div className={Styles.center}>
          <OptimizedImage src={GizmoPNG} alt="Camera Axis Gizmo" />
        </div>
      </main>
      <nav onPointerDown={toggleExpanded}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>arrow-right-circle</title>
          <path d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M6,13H14L10.5,16.5L11.92,17.92L17.84,12L11.92,6.08L10.5,7.5L14,11H6V13Z" />
        </svg>
      </nav>
    </div>
  );
}
