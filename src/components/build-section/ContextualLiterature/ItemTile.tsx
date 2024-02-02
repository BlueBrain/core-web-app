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
        'inline-flex w-full items-center justify-between rounded-md border border-gray-200 py-4 pl-3 pr-6',
        isPending && 'bg-gray-50',
        selectable
          ? 'group cursor-pointer hover:bg-gray-50'
          : 'cursor-default select-none shadow-md'
      )}
      onClick={onSelect}
    >
      <div className="inline-flex w-[90%] flex-col items-start justify-start">
        <span>{index}.</span>
        <div className="text-left text-base font-normal leading-9 text-primary-8 group-hover:font-bold">
          {question}
        </div>
      </div>
      {isPending ? (
        <LoadingOutlined className="transition-all duration-200 ease-out-expo" />
      ) : (
        selectable && (
          <SendOutlined className="text-primary-8 opacity-0 group-hover:opacity-100 group-hover:transition-all group-hover:duration-200 group-hover:ease-out-expo" />
        )
      )}
    </div>
  );
}

export default ItemTile;
