import { forwardRef } from 'react';

import { classNames } from '@/util/utils';

const ResultContainer = forwardRef<
  HTMLDivElement,
  {
    id: string;
    className?: string;
    moreSpace: boolean;
    children: React.ReactNode;
  }
>(({ id, moreSpace, className, children }, ref) => {
  return (
    <div
      id={id}
      ref={ref}
      className={classNames(
        'w-full mt-3',
        moreSpace ? 'mb-4 last:mb-[280px]' : 'mb-28 last:mb-[320px]',
        className
      )}
    >
      {children}
    </div>
  );
});

ResultContainer.displayName = 'ResultContainer';

export default ResultContainer;
