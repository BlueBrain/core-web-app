import { classNames } from '@/util/utils';

export default function GenerativeQASingleResultContainer({
  id,
  moreSpace,
  className,
  children,
}: {
  id: string;
  className?: string;
  moreSpace: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={classNames(
        'w-full mt-3',
        moreSpace ? 'mb-4 last:mb-[280px]' : 'mb-28 last:mb-[320px]',
        className
      )}
    >
      {children}
    </div>
  );
}
