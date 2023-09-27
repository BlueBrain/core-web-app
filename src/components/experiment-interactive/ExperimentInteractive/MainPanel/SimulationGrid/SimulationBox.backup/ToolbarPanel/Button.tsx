import { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  borderless?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export default function Button({ children, borderless = false, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={`w-6 h-6 bg-black rounded-none justify-center items-center inline-flex flex-row items-center ${
        borderless ? `border-none` : `border border-white/30`
      }`}
      onClick={onClick}
    >
      {children ?? '...'}
    </button>
  );
}
