import { ReadOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';

import { contextualLiteratureAtom } from '@/state/literature';
import { classNames } from '@/util/utils';
import { QuestionAbout } from '@/types/literature';
import IconButton from '@/components/IconButton';

function ContextualTrigger({
  about,
  subject,
  densityOrCount,
  className,
}: {
  about: QuestionAbout;
  subject?: string;
  densityOrCount?: 'density' | 'count';
  className: string;
}) {
  const setContextualAtom = useSetAtom(contextualLiteratureAtom);
  const onTriggerContextualLiterature = () => {
    setContextualAtom((prev) => ({
      ...prev,
      about,
      subject,
      densityOrCount,
      contextDrawerOpen: true,
      key: crypto.randomUUID(),
    }));
  };

  return (
    <IconButton
      onClick={onTriggerContextualLiterature}
      className="w-min h-min p-0 hover:!bg-transparent"
    >
      <ReadOutlined className={classNames('h-4 text-base text-white', className)} />
    </IconButton>
  );
}

export default ContextualTrigger;
