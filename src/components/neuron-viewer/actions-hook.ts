import { MutableRefObject, useEffect } from 'react';
import Renderer, { ClickData, HoverData } from '@/services/bluenaas-single-cell/renderer';

export default function useNeuronViewerActions({
  renderer,
  useActions = false,
  actions,
}: {
  useActions?: boolean;
  renderer: MutableRefObject<Renderer | null>;
  actions?: {
    onClick?: (data: ClickData) => void;
    onHover?: (data: HoverData) => void;
    onHoverEnd?: () => void;
  };
}) {
  useEffect(() => {
    if (!useActions) return;
    if (renderer.current) {
      if (actions?.onClick) {
        // eslint-disable-next-line no-param-reassign
        renderer.current.configOnClick = actions.onClick;
      }
      if (actions?.onHover) {
        // eslint-disable-next-line no-param-reassign
        renderer.current.configOnHover = actions.onHover;
      }
      if (actions?.onHoverEnd) {
        // eslint-disable-next-line no-param-reassign
        renderer.current.configOnHoverEnd = actions.onHoverEnd;
      }
    }
  }, [actions?.onClick, actions?.onHover, actions?.onHoverEnd, renderer, useActions]);
}
