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
      <div className="inline-flex items-center w-full gap-2">
        <div className="w-auto h-px bg-neutral-3 flex-[1_1]" />
        <span className="pl-2 text-sm w-max text-neutral-4">
          Asked {format(new Date(askedAt), 'dd.MM.yyyy - kk:mm')}
        </span>
      </div>
      <div className="grid grid-cols-[2fr_1fr] items-center justify-between gap-2  w-full mb-2">
        <div className="inline-flex items-center justify-start w-full flex-[70%] gap-2 my-5">
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
        <div className="inline-flex items-center justify-end gap-2 flex-[30%]">
          {brainRegion?.id && (
            <QABrainRegionPerQuestion id={brainRegion.id} title={brainRegion.title} />
          )}
          <button
            aria-label="Expand question"
            type="button"
            onClick={toggleCollapseQuestion}
            className="flex items-center justify-center w-8 h-8 p-px rounded-full min-w-[2rem] hover:shadow-md"
          >
            <ChevronIcon
              className={classNames(
                'transition-transform duration-300 ease-in-out text-primary-8 fill-current',
                collpaseQuestion ? 'rotate-0' : 'rotate-90'
              )}
            />
          </button>
        </div>
      </div>
    </>
  );
}
