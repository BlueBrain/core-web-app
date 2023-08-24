import { MouseEventHandler, ReactNode } from 'react';

interface ControlPanelButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export default function ControlPanelButton({ children, onClick }: ControlPanelButtonProps) {
  return (
    <button
      type="button"
      className="w-9 h-9 bg-black rounded-lg border border-neutral-400 justify-center items-center gap-2.5 inline-flex flex-row items-center"
      onClick={onClick}
    >
      {children ?? '...'}
    </button>
  );
}
