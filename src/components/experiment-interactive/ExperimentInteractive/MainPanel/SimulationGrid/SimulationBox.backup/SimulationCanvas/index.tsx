import { useEffect, useRef } from 'react';

import { useSimulationPreview } from '../hooks';
import { basePath } from '@/config';

export default function SimulationCanvas() {
  const { isLoading } = useSimulationPreview();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const simulationImage = new Image();
      simulationImage.src = `${basePath}/images/experiment-interactive/mock.png`;
      simulationImage.onload = () => {
        if (context !== null) {
          context.drawImage(simulationImage, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
        isLoading ? `grayscale opacity-50` : ``
      }`}
    />
  );
}
