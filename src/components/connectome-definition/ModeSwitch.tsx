import { DragOutlined, ExpandOutlined } from '@ant-design/icons';
import { classNames } from '@/util/utils';

const baseClasses = 'rounded-lg text-white flex items-center px-4 py-2 gap-2.5';

export default function ModeSwitch({
  zoom,
  select,
  unselect,
  setZoom,
  setSelect,
  setUnselect,
}: {
  zoom: boolean;
  select: boolean;
  unselect: boolean;
  setZoom: () => void;
  setSelect: () => void;
  setUnselect: () => void;
}) {
  const highlightedClass = 'bg-slate-700 font-semibold';

  return (
    <>
      <button
        className={classNames(baseClasses, zoom && highlightedClass)}
        type="button"
        disabled={zoom}
        onClick={setZoom}
      >
        <DragOutlined />
        Move
      </button>
      <button
        className={classNames(baseClasses, select && highlightedClass)}
        type="button"
        disabled={select}
        onClick={setSelect}
      >
        <ExpandOutlined />
        Select
      </button>
      <button
        className={classNames(baseClasses, unselect && highlightedClass)}
        type="button"
        disabled={unselect}
        onClick={setUnselect}
      >
        <ExpandOutlined />
        Unselect
      </button>
    </>
  );
}
