import { format } from 'date-fns';

import { QABrainRegionPerQuestion } from '../QABrainRegion';
import { classNames } from '@/util/utils';
import { ChevronIcon } from '@/components/icons';
import { SucceededGenerativeQA } from '@/types/literature';
import BrainLight from '@/components/icons/BrainLight';

type ResultHeaderProps = Pick<SucceededGenerativeQA, 'askedAt' | 'question' | 'brainRegion'> & {
  collpaseQuestion?: boolean;
  toggleCollapseQuestion: () => void;
};

export default function ResultHeader({
  question,
  askedAt,
  brainRegion,
  collpaseQuestion,
  toggleCollapseQuestion,
}: ResultHeaderProps) {
  return (
    <>
      <div className="inline-flex w-full items-center gap-2">
        <div className="h-px w-auto flex-[1_1] bg-neutral-3" />
        <span className="w-max pl-2 text-sm text-neutral-4">
          Asked {format(new Date(askedAt), 'dd.MM.yyyy - kk:mm')}
        </span>
      </div>
      <div className="mb-2 grid w-full grid-cols-[2fr_1fr] items-center  justify-between gap-2">
        <div className="my-5 inline-flex w-full flex-[70%] items-center justify-start gap-2">
          <BrainLight />
          <span
            className={classNames(
              'font-normal tracking-tight text-blue-900',
              collpaseQuestion ? 'text-xl font-extrabold' : 'text-sm'
            )}
            data-testid="question-result"
          >
            {question}
          </span>
        </div>
        <div className="inline-flex flex-[30%] items-center justify-end gap-2">
          {brainRegion?.id && (
            <QABrainRegionPerQuestion id={brainRegion.id} title={brainRegion.title} />
          )}
          <button
            aria-label="Expand question"
            type="button"
            onClick={toggleCollapseQuestion}
            className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full p-px hover:shadow-md"
          >
            <ChevronIcon
              className={classNames(
                'fill-current text-primary-8 transition-transform duration-300 ease-in-out',
                collpaseQuestion ? 'rotate-0' : 'rotate-90'
              )}
            />
          </button>
        </div>
      </div>
    </>
  );
}
