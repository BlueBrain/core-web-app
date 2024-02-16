import { RefObject, useReducer } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

export default function FullScreen({
  elementRef,
}: {
  elementRef?: RefObject<HTMLDivElement> | null;
}) {
  const [isFullScreen, toggleFullScreen] = useReducer((value) => !value, false);

  const onFullScreenEnter = () => {
    if (elementRef?.current && !document.fullscreenElement) {
      elementRef.current.requestFullscreen();
      toggleFullScreen();
    }
  };
  const onFullScreenExit = () => {
    if (elementRef?.current && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
      toggleFullScreen();
    }
  };

  return (
    <div className="absolute left-4 top-4 z-50 cursor-pointer text-white">
      {isFullScreen ? (
        <FullscreenExitOutlined className="h-5 w-5 text-xl" onClick={onFullScreenExit} />
      ) : (
        <FullscreenOutlined className="h-5 w-5 text-xl" onClick={onFullScreenEnter} />
      )}
    </div>
  );
}
