import React from 'react';
import { MorphologyPainter } from '@bbp/morphoviewer';

import { classNames } from '@/util/utils';

import styles from './scalebar.module.css';

interface ScalebarProps {
  painter: MorphologyPainter;
  className?: string;
}

export function Scalebar({ className, painter }: ScalebarProps) {
  const scalebar = useScalebar(painter);
  if (!scalebar) return null;

  return (
    <div
      className={classNames(styles.main, className)}
      style={{ width: `${scalebar.sizeInPixel}px` }}
    >
      <div>
        {scalebar.value} {scalebar.unit}
      </div>
      <hr />
    </div>
  );
}

interface ScalebarAttributes {
  sizeInPixel: number;
  value: number;
  unit: string;
}

function useScalebar(painter: MorphologyPainter): ScalebarAttributes | null {
  const [scalebar, setScalebar] = React.useState(painter.computeScalebar());
  React.useEffect(() => {
    const update = () => {
      setScalebar(painter.computeScalebar());
    };
    painter.eventPixelScaleChange.addListener(update);
    return () => painter.eventPixelScaleChange.removeListener(update);
  }, [painter]);
  return scalebar;
}
