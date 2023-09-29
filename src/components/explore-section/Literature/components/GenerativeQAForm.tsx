'use client';

import { CloseCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';

import useChatQAContext from '../useChatQAContext';

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
  ask,
  children,
  label,
  isPending,
}: {
  ask: (data: FormData) => void;
  isPending: boolean;
  children?: React.ReactNode;
  label?: string;
}) {
  const { query, onValueChange, onQuestionClear } = useChatQAContext({});
  return (
    <form name="qa-form" className="w-full" action={ask}>
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
          placeholder="Send your question"
          className="block w-full text-base font-semibold bg-transparent outline-none text-primary-8 placeholder:text-blue-900 placeholder:text-base placeholder:font-normal placeholder:leading-snug focus:shadow-none"
        />
        <div className="inline-flex items-center justify-center gap-2">
          {(isPending || (query && !!query.length)) && (
            <FormButton
              type="button"
              icon={
                isPending ? (
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
