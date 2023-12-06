import { LoadingOutlined, SendOutlined } from '@ant-design/icons';

import { classNames } from '@/util/utils';

type Props = {
  index?: number;
  question?: JSX.Element;
  onSelect?(): void;
  isPending?: boolean;
  selectable?: boolean;
};

function ItemTile({ index, question, onSelect, isPending, selectable = true }: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={classNames(
        'inline-flex items-center justify-between w-full py-4 pl-3 pr-6 border border-gray-200 rounded-md',
        isPending && 'bg-gray-50',
        selectable
          ? 'group hover:bg-gray-50 cursor-pointer'
          : 'cursor-default select-none shadow-md'
      )}
      onClick={onSelect}
    >
      <div className="w-[90%] inline-flex flex-col items-start justify-start">
        <span>{index}.</span>
        <div className="font-normal text-left group-hover:font-bold text-primary-8 text-base leading-9">
          {question}
        </div>
      </div>
      {isPending ? (
        <LoadingOutlined className="transition-all duration-200 ease-out-expo" />
      ) : (
        selectable && (
          <SendOutlined className="opacity-0 text-primary-8 group-hover:opacity-100 group-hover:transition-all group-hover:duration-200 group-hover:ease-out-expo" />
        )
      )}
    </div>
  );
}

export default ItemTile;
