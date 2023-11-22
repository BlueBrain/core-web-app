import { format } from 'date-fns';

import { QABrainRegionPerQuestion } from '../QABrainRegion';
import { classNames } from '@/util/utils';
import { ChevronIcon } from '@/components/icons';
import BrainLight from '@/components/icons/BrainLight';
import { GenerativeQASingleResultProps } from '@/types/literature';

type GenerativeQASingleResultHeaderProps = Pick<
  GenerativeQASingleResultProps,
  'askedAt' | 'question' | 'brainRegion'
> & {
  collpaseQuestion?: boolean;
  toggleCollapseQuestion: () => void;
};

export default function GenerativeQASingleResultHeader({
  question,
  askedAt,
  brainRegion,
  collpaseQuestion,
  toggleCollapseQuestion,
}: GenerativeQASingleResultHeaderProps) {
  return (
    <>
      <div className="inline-flex items-center w-full gap-2">
        <div className="w-auto h-px bg-neutral-3 flex-[1_1]" />
        <span className="pl-2 text-sm w-max text-neutral-4">
          Asked {format(new Date(askedAt), 'dd.MM.yyyy - kk:mm')}
        </span>
      </div>
      <div className="inline-flex items-center justify-between w-full mb-2">
        <div className="inline-flex items-center justify-start w-full gap-2 my-5">
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
        <div className="inline-flex items-center justify-end gap-2">
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
