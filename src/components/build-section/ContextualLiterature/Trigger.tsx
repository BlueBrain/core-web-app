import { useTransition } from 'react';
import { ReadOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';

import { contextualLiteratureAtom } from '@/state/literature';
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
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const path = usePathname();
  const [, startTransition] = useTransition();
  const setContextualAtom = useSetAtom(contextualLiteratureAtom);

  const onTriggerContextualLiterature = () => {
    params.set('chatId', crypto.randomUUID());
    router.replace(`${path}?${params.toString()}`);
    startTransition(() => {
      setContextualAtom((prev) => ({
        ...prev,
        about,
        subject,
        densityOrCount,
        contextDrawerOpen: true,
        key: crypto.randomUUID(),
      }));
    });
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
