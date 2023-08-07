'use client';

import React, { useTransition } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLiteratureAtom, literatureAtom, literatureResultAtom } from '../state';
import { TGenerativeQA } from '../types';
import { LiteratureValidationError } from '../errors';
import { getGenerativeQAAction } from '../actions';
import { scrollToBottom } from '../utils';
import SendIcon from '@/components/icons/SendIcon';
import { classNames } from '@/util/utils';

type TFormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  type: 'submit' | 'button';
};

function FormButton({ icon, type, ...props }: TFormButtonProps) {
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
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const [isGQAPending, startGenerativeQATransition] = useTransition();

  const isChatBarMustSlideInDown = Boolean(QAs.length);
  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    update('query', value);
  const onQuestionClear = () => update('query', '');
  const onGenerativeQAFinished = (
    generativeQA: TGenerativeQA | LiteratureValidationError | null
  ) => {
    if (generativeQA && !(generativeQA instanceof LiteratureValidationError)) {
      updateResult([...QAs, generativeQA]);
    }
    update('query', '');
    scrollToBottom();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form
        name="qa-form"
        action={async (data: FormData) => {
          startGenerativeQATransition(async () => {
            const response = await getGenerativeQAAction(data);
            onGenerativeQAFinished(response);
          });
        }}
        className={classNames(
          'bg-white p-4 w-full left-0 right-0 z-50 rounded-2xl border border-zinc-100 flex-col justify-start items-start gap-2.5 inline-flex max-w-4xl mx-auto',
          isChatBarMustSlideInDown
            ? 'transition-all duration-300 ease-out-expo fixed bottom-0  rounded-b-none pb-0'
            : ''
        )}
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
              <FormButton type="submit" icon={<SendIcon className="text-base text-primary-8" />} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GenerativeQAInputBar;
