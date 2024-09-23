import React from 'react';
import { Popover, PopoverProps } from 'antd';
import { classNames } from '@/util/utils';

type Props = {
  message: React.ReactNode;
  children: React.ReactNode;
  when?: PopoverProps['trigger'];
  placement?: PopoverProps['placement'];
  onConfirm?: () => void;
};

export default function CustomPopover({
  onConfirm,
  message,
  children,
  when = ['click'],
  placement = 'topRight',
}: Props) {
  return (
    <Popover
      placement={placement}
      getPopupContainer={(trigger) => trigger.parentElement!}
      getTooltipContainer={(trigger) => trigger.parentElement!}
      trigger={when}
      overlayClassName={classNames(
        '[&_.ant-popover-inner]:!p-0 [&_.ant-popover-inner]:!bg-primary-8 max-w-[260px]',
        '[&_.ant-popover-arrow:before]:bg-primary-8'
      )}
      destroyTooltipOnHide
      content={
        <div className="flex flex-col items-center justify-center gap-4 bg-primary-8 p-8">
          <p className="text-center text-base font-light text-white">{message}</p>
          {onConfirm && (
            <button
              type="button"
              className="border border-white bg-primary-8 px-7 py-3 font-bold text-white"
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
}
