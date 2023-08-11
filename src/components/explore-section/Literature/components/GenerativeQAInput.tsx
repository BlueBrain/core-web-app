'use client';

import { FormEvent, useTransition } from 'react';
import { useAtomValue } from 'jotai';
import { CloseCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';

import { getGenerativeQA } from '../api';
import { LiteratureValidationError } from '../errors';
import sessionAtom from '@/state/session';
import { classNames } from '@/util/utils';
import { literatureAtom, useLiteratureAtom, useLiteratureResultsAtom } from '@/state/literature';
import { GenerativeQA } from '@/types/literature';

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  type: 'submit' | 'button';
};

function FormButton({ icon, type, ...props }: FormButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={type === 'submit' ? 'submit' : 'button'}
      className="text-sm font-medium text-white rounded-lg outline-none focus-within:shadow-none"
    >
      {icon}
    </button>
  );
}

function GenerativeQAInputBar() {
  const update = useLiteratureAtom();
  const { query } = useAtomValue(literatureAtom);
  const { update: updateResults, QAs } = useLiteratureResultsAtom();
  const [isGQAPending, startGenerativeQATransition] = useTransition();
  const session = useAtomValue(sessionAtom);

  const isChatBarMustSlideInDown = Boolean(QAs.length);
  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    update('query', value);
  const onQuestionClear = () => update('query', '');
  const onGenerativeQAFinished = (
    generativeQA: GenerativeQA | LiteratureValidationError | null
  ) => {
    if (generativeQA && !(generativeQA instanceof LiteratureValidationError)) {
      update('activeQuestionId', generativeQA.id);
      updateResults(generativeQA);
    }
    update('query', '');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startGenerativeQATransition(async () => {
      const question = event.currentTarget['gqa-question'].value as string;
      const generativeQA = await getGenerativeQA({ question, session });
      onGenerativeQAFinished(generativeQA);
    });
  };

  return (
    <div
      className={classNames(
        ' flex flex-col items-center justify-center w-full pr-4',
        isChatBarMustSlideInDown
          ? 'absolute bottom-0 left-0 right-0'
          : 'fixed top-1/2 -translate-y-1/2'
      )}
    >
      <form
        name="qa-form"
        className={classNames(
          'bg-white p-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex max-w-4xl mx-auto',
          isChatBarMustSlideInDown
            ? 'transition-all duration-300 ease-out-expo rounded-b-none pb-0'
            : ''
        )}
        onSubmit={handleSubmit}
      >
        <div
          className={classNames(
            'inline-flex flex-col items-start justify-start w-full px-6 py-8  bg-primary-0',
            isChatBarMustSlideInDown ? 'rounded-b-none' : 'rounded-lg'
          )}
        >
          <div className="pb-1.5 border-b border-sky-400 justify-between items-center gap-2.5 inline-flex w-full">
            <input
              type="text"
              id="gqa-question"
              name="gqa-question"
              autoComplete="off"
              className="block w-full text-base font-semibold bg-transparent outline-none text-primary-8 placeholder:text-blue-900 placeholder:text-base placeholder:font-normal placeholder:leading-snug focus:shadow-none"
              placeholder="Send your question"
              onChange={onChange}
              value={query}
              disabled={isGQAPending}
            />
            <div className="inline-flex items-center justify-center gap-2">
              {(isGQAPending || !!query.length) && (
                <FormButton
                  type="button"
                  icon={
                    isGQAPending ? (
                      <LoadingOutlined className="text-base text-primary-8" />
                    ) : (
                      !!query.length && <CloseCircleOutlined className="text-base text-primary-8" />
                    )
                  }
                  onClick={onQuestionClear}
                />
              )}
              <FormButton
                disabled={isGQAPending}
                type="submit"
                icon={<SendOutlined className="text-base -rotate-[30deg] text-primary-8" />}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GenerativeQAInputBar;
