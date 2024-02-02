import { ReadOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';

import { contextualLiteratureAtom, promptResponseNodesAtomFamily } from '@/state/literature';
import { classNames } from '@/util/utils';
import { QuestionAbout } from '@/types/literature';
import IconButton from '@/components/IconButton';
import usePathname from '@/hooks/pathname';

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
  const { replace: replaceRoute } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams()!;
  const setContextualAtom = useSetAtom(contextualLiteratureAtom);
  const isLiteraturePage = path?.startsWith('/build/cell-composition/literature');

  const onTriggerContextualLiterature = () => {
    promptResponseNodesAtomFamily.setShouldRemove(() => true);
    promptResponseNodesAtomFamily.setShouldRemove(null);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('chatId');
    params.set('contextual', 'true');

    setContextualAtom((prev) => ({
      ...prev,
      about,
      subject,
      densityOrCount,
      drawerOpen: true,
      key: crypto.randomUUID(),
    }));

    if (path) {
      replaceRoute(`${path}?${params.toString()}`);
    }
  };

  if (isLiteraturePage) return null;
  return (
    <IconButton
      onClick={onTriggerContextualLiterature}
      className="h-min w-min p-0 hover:!bg-transparent"
    >
      <ReadOutlined className={classNames('h-4 text-base text-white', className)} />
    </IconButton>
  );
}

export default ContextualTrigger;
