import { EyeOutlined } from '@ant-design/icons';
import { PlotDataEntry } from '@/services/bluenaas-single-cell/types';

type Props = {
  trace: PlotDataEntry;
  isVisible: boolean;
  toggleVisibility: () => void;
};

export default function LegendItem({ trace, isVisible, toggleVisibility }: Props) {
  return (
    <button
      type="button"
      className="my-1 mr-2 flex w-fit flex-wrap items-center rounded-full border px-4 py-1 text-sm"
      style={{ borderColor: isVisible ? trace.line?.color : '#8C8C8C' }}
      onClick={toggleVisibility}
    >
      <span className={isVisible ? 'text-primary-8' : 'text-gray-400'}>
        {trace.amplitude ?? trace.name}
      </span>
      {isVisible ? (
        <span
          className="ml-3 h-[10px] w-[10px] rounded-full border"
          style={{ backgroundColor: trace.line?.color }}
        />
      ) : (
        <EyeOutlined className="ml-3 text-gray-400" />
      )}
    </button>
  );
}
