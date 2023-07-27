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
    <div className="relative w-8 h-8 flex flex-row justify-center items-center">
      <div
        className={classNames(
          'block w-4 2xl:w-6 h-0.5 rounded-full origin-center absolute z-20 transition-transform duration-300 ease-in-out transform',
          status ? '0' : 'rotate-90',
          backgroundColor
        )}
      />
      <div className={`block w-4 2xl:w-6 h-0.5 ${backgroundColor} rounded-full`} />
    </div>
  );
}
