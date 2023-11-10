'use client';

import { CloseCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import kebabCase from 'lodash/kebabCase';
import find from 'lodash/find';
import { useAtom } from 'jotai';

import { ASKED_TIME_SEPARATOR } from '../utils/DTOs';
import { literatureAtom, literatureResultAtom } from '@/state/literature';
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

export function GenerativeQAForm({
  children,
  label,
}: {
  children?: React.ReactNode;
  label?: string;
}) {
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const [{ query, isGenerating }, updateLA] = useAtom(literatureAtom);

  const onQuestionClear = () =>
    updateLA((prev) => ({
      ...prev,
      query: '',
    }));

  const onValueChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    updateLA((prev) => ({
      ...prev,
      query: value,
    }));

  const buildQuestionEntryBaseObject = ({
    questionId,
    question,
    streamed,
    askedAt,
  }: {
    questionId: string;
    question: string;
    streamed: boolean;
    askedAt: Date;
  }) => {
    if (!find(QAs, (o) => o.id === questionId)) {
      const newQuestion = {
        id: questionId,
        question,
        answer: '',
        streamed,
        askedAt,
      } as GenerativeQA;
      updateResult((prevQAs) => [...prevQAs, newQuestion]);
    }
  };

  const onQAFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const askedAt = new Date();
    const question = String(formData.get('gqa-question'));
    const questionId = `${kebabCase(question)}-${ASKED_TIME_SEPARATOR}${askedAt.getTime()}`;
    updateLA((prev) => ({
      ...prev,
      isGenerating: true,
    }));
    buildQuestionEntryBaseObject({
      questionId,
      question,
      askedAt,
      streamed: false,
    });
  };

  return (
    <form name="qa-form" className="w-full" onSubmit={onQAFormSubmit}>
      {label && (
        <label htmlFor="gqa-question" className="mb-8 text-base text-slate-400">
          {label}
        </label>
      )}
      <div className="pb-1.5 border-b border-sky-400 justify-between items-center gap-2.5 inline-flex w-full">
        <input
          type="text"
          id="gqa-question"
          name="gqa-question"
          autoComplete="off"
          value={query}
          onChange={onValueChange}
          disabled={isGenerating}
          placeholder="Send your question"
          className="block w-full text-base font-semibold bg-transparent outline-none text-primary-8 placeholder:text-blue-900 placeholder:text-base placeholder:font-normal placeholder:leading-snug focus:shadow-none"
        />
        <div className="inline-flex items-center justify-center gap-2">
          {(isGenerating || (query && !!query.length)) && (
            <FormButton
              type="button"
              icon={
                isGenerating ? (
                  <LoadingOutlined className="text-base text-primary-8" />
                ) : (
                  query &&
                  !!query.length && <CloseCircleOutlined className="text-base text-primary-8" />
                )
              }
              onClick={onQuestionClear}
            />
          )}
          <FormButton
            type="submit"
            icon={<SendOutlined className="text-base -rotate-[30deg] text-primary-8" />}
          />
        </div>
      </div>

      {children}
    </form>
  );
}
