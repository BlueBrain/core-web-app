import { CaretRightOutlined } from '@ant-design/icons';

import { classNames } from '@/util/utils';
import { BrainViewId } from '@/types/ontologies';

export type ViewOption = {
  value: BrainViewId;
  label: string;
  isDisabled?: boolean;
};

export default function SelectView({
  colorCode,
  openDropdown,
  defaultViewOption,
  viewOptions,
  onChangeViewSelection,
  toggleDropdown,
}: {
  colorCode: string | undefined;
  openDropdown: boolean;
  toggleDropdown: React.DispatchWithoutAction;
  defaultViewOption: ViewOption;
  viewOptions: ViewOption[];
  onChangeViewSelection: (newViewId: BrainViewId | undefined) => void;
}) {
  return (
    <div
      style={{ backgroundColor: colorCode }}
      className={classNames(
        'w- brain-regions-views w-full min-w-[7rem] text-sm',
        openDropdown && 'brain-regions-views-open'
      )}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={classNames(
          'flex w-full select-none items-center justify-between gap-4 border px-2 py-1 mix-blend-difference',
          openDropdown ? 'rounded-md rounded-b-none border-b-0' : 'rounded-full'
        )}
        style={{ borderColor: colorCode }}
      >
        <div style={{ color: colorCode }} className="mix-blend-difference">
          {defaultViewOption.label}
        </div>
        <CaretRightOutlined
          className={classNames(
            'h-[12px] mix-blend-difference',
            openDropdown && 'rotate-90 transform transition-all duration-200 ease-out'
          )}
          style={{ color: colorCode }}
        />
      </button>
      <div
        style={{ borderColor: colorCode, color: colorCode }}
        className={classNames(
          'flex-col justify-center gap-y-px px-2 py-1 mix-blend-difference',
          openDropdown ? 'flex rounded-md rounded-t-none  border border-t-0' : 'hidden'
        )}
      >
        {viewOptions
          .filter(({ value }) => value !== defaultViewOption.value)
          .map(({ value, label }) => (
            <button
              type="button"
              key={value}
              onClick={() => onChangeViewSelection(value)}
              className={classNames(
                '-mx-1 rounded-sm p-1 text-left',
                'hover:bg-white/20 hover:font-semibold hover:shadow-sm hover:backdrop-blur-sm'
              )}
            >
              {label}
            </button>
          ))}
      </div>
    </div>
  );
}
