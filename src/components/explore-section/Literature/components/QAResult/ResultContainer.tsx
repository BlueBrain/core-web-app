import { classNames } from '@/util/utils';

export default function ResultContainer({
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
    <div id={id} className={classNames('mt-3 w-full', moreSpace ? 'mb-4' : 'mb-28', className)}>
      {children}
    </div>
  );
}
