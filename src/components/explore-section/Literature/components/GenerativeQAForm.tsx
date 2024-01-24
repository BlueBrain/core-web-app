'use client';

import { useRef } from 'react';
import { CloseCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';

import useAutosizeTextArea from '../useAutosizeTextarea';
import { useContextSearchParams } from '../useContextualLiteratureContext';
import {
  literatureAtom,
  literatureResultAtom,
  promptResponseNodesAtomFamily,
} from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { classNames } from '@/util/utils';
import { StopLoading } from '@/components/icons/StopLoading';
import usePathname from '@/hooks/pathname';

type FormButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  type: 'submit' | 'button';
};

function SubmitQuestion() {
  const [{ query, isGenerating }, updateLiterature] = useAtom(literatureAtom);
  const isQuestionEmpty = query.trim().length === 0;
  return (
    <button
      type="submit"
      disabled={isQuestionEmpty || isGenerating}
      title={isQuestionEmpty ? 'Please enter a question' : ''}
      className="rounded w-max py-1.5 px-4 text-primary-8 border border-gray-200 font-semibold disabled:text-gray-400"
      onClick={() => {
        updateLiterature((prev) => ({ ...prev, areQAParamsVisible: false }));
      }}
    >
      Search <SendOutlined className="text-base -rotate-[30deg] ml-1" />
    </button>
  );
}

function FormButton({ icon, type, className, ...props }: FormButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={type === 'submit' ? 'submit' : 'button'}
      className="focus-within:shadow-none rounded-lg text-sm text-white outline-none font-medium"
    >
      {icon}
    </button>
  );
}

export default function QAForm({
  children,
  label,
  onExternalSubmit,
}: {
  children?: React.ReactNode;
  label?: string;
  onExternalSubmit?: ({
    id,
    chatId,
    newQuestion,
  }: {
    id: string;
    chatId: string;
    newQuestion: Partial<GenerativeQA>;
  }) => void;
}) {
  const { replace: replaceRoute } = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const [{ query, isGenerating, controller, areQAParamsVisible }, updateLiterature] =
    useAtom(literatureAtom);
  const currentBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const { isContextualLiterature } = useContextSearchParams();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const onQuestionClear = () => {
    updateLiterature((prev) => ({
      ...prev,
      query: '',
    }));
  };

  const onValueChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current && value.trim() === '') textAreaRef.current.style.height = `0px`;
    updateLiterature((prev) => ({
      ...prev,
      query: value,
    }));
  };

  const onAbort = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    controller?.abort();
    // if you are using ContextualLiterature, the currated questions family atom
    // will not trigger the stream after the first abort
    // remove the question from the family map to enable the stream again
    if (promptResponseNodesAtomFamily.length) promptResponseNodesAtomFamily.remove({ key: query });
  };

  const submit = (question: string) => {
    const askedAt = new Date();
    const id = `${kebabCase(question)}-${askedAt.getTime()}`;
    let chatId = searchParams?.get('chatId');

    if (isContextualLiterature && !chatId) {
      chatId = crypto.randomUUID();
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('chatId', chatId);
      replaceRoute(`${pathname}?${params.toString()}`);
    } else if (isContextualLiterature && chatId) {
      chatId = searchParams?.get('chatId');
    } else {
      chatId = crypto.randomUUID();
    }

    updateLiterature((prev) => ({
      ...prev,
      id,
      isGenerating: true,
      activeQuestionId: id,
      controller: new AbortController(),
    }));
    const newQuestion = {
      id,
      question,
      askedAt,
      chatId,
      streamed: false,
      brainRegion: currentBrainRegion ? pick(currentBrainRegion, ['id', 'title']) : undefined,
    } as GenerativeQA;

    updateResult([...QAs, newQuestion]);
    onExternalSubmit?.({ id, newQuestion, chatId: chatId! });
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);
    const question = String(formData.get('gqa-question'));
    submit(question);
  };

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      submit(event.currentTarget.value);
    }
  };

  useAutosizeTextArea(textAreaRef.current, query);

  return (
    <form
      name="qa-form"
      className={classNames(
        'w-full',
        areQAParamsVisible ? 'flex flex-col-reverse' : 'flex flex-row items-baseline'
      )}
      onSubmit={onFormSubmit}
    >
      {label && (
        <label htmlFor="gqa-question" className="mr-2 text-base text-slate-400">
          {label}
        </label>
      )}
      <div className={classNames('w-full pb-1.5 justify-between items-end gap-2.5 flex')}>
        <textarea
          ref={textAreaRef}
          id="gqa-question"
          name="gqa-question"
          autoComplete="off"
          value={query}
          onChange={onValueChange}
          onKeyDown={onEnterKeyDown}
          disabled={isGenerating}
          placeholder="Your question"
          tabIndex={0}
          rows={1}
          className={classNames(
            'm-0 w-full resize-none overflow-y-hidden outline-none max-h-52 p-0 pb-2 min-h-[24px] box-border border-b border-gray-200',
            'text-base font-semibold bg-transparent text-primary-8 focus:shadow-none',
            'placeholder:text-blue-900 placeholder:text-base placeholder:font-semibold placeholder:leading-snug'
          )}
        />
        <div className="inline-flex items-center justify-center gap-2">
          {!isGenerating && query && !!query.length && (
            <FormButton
              type="button"
              icon={<CloseCircleOutlined className="text-base text-primary-8" />}
              onClick={onQuestionClear}
            />
          )}
          {isGenerating ? (
            <FormButton
              type="button"
              onClick={onAbort}
              icon={<StopLoading className="text-primary-6 w-6 h-6" />}
            />
          ) : (
            <SubmitQuestion />
          )}
        </div>
      </div>
      {children}
    </form>
  );
}
