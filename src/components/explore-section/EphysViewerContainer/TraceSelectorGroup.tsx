import { ChangeEvent } from 'react';
import { classNames } from '@/util/utils';

type TraceSelectorGroupProps = {
  selectedSweeps: string[];
  sweepsOptions: { label: string; value: string }[];
  handlePreviewSweep: (value?: string) => void;
  setSelectedSweeps: (sweeps: string[]) => void;
  colorMapper: { [key: string]: string };
  previewItem?: string;
};

function TraceSelectorGroup({
  previewItem,
  selectedSweeps,
  sweepsOptions,
  handlePreviewSweep,
  setSelectedSweeps,
  colorMapper,
}: TraceSelectorGroupProps) {
  const sweeps = sweepsOptions.map(({ label, value }) => {
    const isSelected = selectedSweeps.includes(value);
    const isEmptySelection = !selectedSweeps.length;
    const isHighlight = isSelected || (isEmptySelection && !previewItem);

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      const { value: checkboxValue, checked } = target;

      if (checked) {
        setSelectedSweeps([...selectedSweeps, checkboxValue]);
      } else {
        setSelectedSweeps(selectedSweeps.filter((sweep) => sweep !== checkboxValue));
      }

      handlePreviewSweep(undefined);
    };

    return (
      <label // eslint-disable-line jsx-a11y/label-has-associated-control
        className={classNames(
          'block flex h-[32px] w-[32px] cursor-pointer items-center rounded hover:opacity-75',
          isSelected ? 'border-[#1890ff]' : 'border-[#1890ff00]'
        )}
        style={{
          background: colorMapper[value] || '#1890ff',
        }}
        key={label}
        onMouseEnter={() => handlePreviewSweep(value)}
        onMouseLeave={() => handlePreviewSweep(undefined)}
      >
        <input
          id="sweepInput"
          className="hidden"
          checked={isSelected}
          type="checkbox"
          value={value}
          onChange={handleChange}
        />
        <span style={{ display: isHighlight ? 'none' : undefined }} />
      </label>
    );
  });

  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-dark">
        Sweep <small className="text-sm font-light">({sweepsOptions.length} available)</small>
      </span>
      <div className="flex items-center gap-3">{sweeps}</div>
    </div>
  );
}

export default TraceSelectorGroup;
