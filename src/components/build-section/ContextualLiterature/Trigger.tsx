import { ReadOutlined } from '@ant-design/icons';

import { useContextualLiteratureAtom } from '@/state/literature';
import IconButton from '@/components/IconButton';
import { classNames } from '@/util/utils';

function ContextualTrigger({
  about,
  subject,
  densityOrCount,
  className,
}: {
  about: string;
  subject?: string;
  densityOrCount?: 'density' | 'count';
  className: string;
}) {
  const { update } = useContextualLiteratureAtom();
  // TODO: in the next MR I will be using the `useSetAtom` to update in bulk all the fields
  // NOTE: --> all the updates here will have the same performance as bulk update since both react&jotai will batch the state update
  const onTriggerContextualLiterature = () => {
    update('about', about);
    update('contextDrawerOpen', true);
    update('subject', subject);
    update('densityOrCount', densityOrCount);
  };

  return (
    <IconButton onClick={onTriggerContextualLiterature}>
      <ReadOutlined className={classNames('h-4 text-base text-white', className)} />
    </IconButton>
  );
}

export default ContextualTrigger;
