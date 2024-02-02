import { MouseEventHandler, ReactNode } from 'react';

interface ControlPanelButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export default function ControlPanelButton({ children, onClick }: ControlPanelButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 flex-row items-center items-center justify-center gap-2.5 rounded-lg border border-neutral-400 bg-black"
      onClick={onClick}
    >
      {children ?? '...'}
    </button>
  );
}
