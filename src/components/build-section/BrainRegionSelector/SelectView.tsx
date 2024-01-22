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
        'text-sm w-full min-w-[7rem] w- brain-regions-views',
        openDropdown && 'brain-regions-views-open'
      )}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={classNames(
          'w-full flex items-center justify-between gap-4 border py-1 px-2 select-none mix-blend-difference',
          openDropdown ? 'rounded-md border-b-0 rounded-b-none' : 'rounded-full'
        )}
        style={{ borderColor: colorCode }}
      >
        <div style={{ color: colorCode }} className="mix-blend-difference">
          {defaultViewOption.label}
        </div>
        <CaretRightOutlined
          className={classNames(
            'h-[12px] mix-blend-difference',
            openDropdown && 'transform rotate-90 transition-all ease-out duration-200'
          )}
          style={{ color: colorCode }}
        />
      </button>
      <div
        style={{ borderColor: colorCode, color: colorCode }}
        className={classNames(
          'py-1 px-2 flex-col justify-center gap-y-px mix-blend-difference',
          openDropdown ? 'flex border border-t-0  rounded-md rounded-t-none' : 'hidden'
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
                'text-left p-1 -mx-1 rounded-sm',
                'hover:shadow-sm hover:bg-white/20 hover:backdrop-blur-sm hover:font-semibold'
              )}
            >
              {label}
            </button>
          ))}
      </div>
    </div>
  );
}
