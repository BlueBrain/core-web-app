'use client';

import { classNames } from '@/util/utils';

type TOpenCloseIconButtonProps = {
  status: boolean;
  backgroundColor?: string;
};

export default function OpenCloseIconButton({
  status,
  backgroundColor = 'bg-white',
}: TOpenCloseIconButtonProps) {
  return (
    <div className="relative flex h-8 w-8 flex-row items-center justify-center">
      <div
        className={classNames(
          'absolute z-20 block h-0.5 w-4 origin-center transform rounded-full transition-transform duration-300 ease-in-out 2xl:w-6',
          status ? '0' : 'rotate-90',
          backgroundColor
        )}
      />
      <div className={`block h-0.5 w-4 2xl:w-6 ${backgroundColor} rounded-full`} />
    </div>
  );
}
