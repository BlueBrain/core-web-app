import { MutableRefObject, useEffect } from 'react';
import Renderer, {
  NeuronViewerClickData,
  NeuronViewerHoverHoverData,
} from '@/services/bluenaas-single-cell/renderer';

export default function useNeuronViewerActions({
  renderer,
  useActions = false,
  actions,
}: {
  useActions?: boolean;
  renderer: MutableRefObject<Renderer | null>;
  actions?: {
    onClick?: (data: NeuronViewerClickData) => void;
    onHover?: (data: NeuronViewerHoverHoverData) => void;
    onHoverEnd?: (data: NeuronViewerHoverHoverData) => void;
    onZoom?: (data: NeuronViewerHoverHoverData) => void;
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
      if (actions?.onHoverEnd) {
        // eslint-disable-next-line no-param-reassign
        renderer.current.configOnHoverEnd = actions.onHoverEnd;
      }
    }
  }, [actions?.onClick, actions?.onHover, actions?.onHoverEnd, renderer, useActions]);
}
