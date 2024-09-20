import { ReactNode } from 'react';
import { WarningFilled } from '@ant-design/icons';

import Header from './Header';

type Props = {
  message?: string | null;
};

export default function ErrorMessageLine({ message }: Props) {
  if (!message) return null;

  return <div className="text-xs text-red-400">{message}</div>;
}

export function ErrorMessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-4 border border-error p-16 text-xl text-error">
      <WarningFilled style={{ fontSize: 24 }} />
      {message}
    </div>
  );
}

export function InfoMessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-4 border border-neutral-3 p-16 text-xl text-neutral-4">
      {message}
    </div>
  );
}

export function StandardFallback({
  children,
  type,
}: {
  children: ReactNode;
  type: 'error' | 'info';
}) {
  function renderSwitch() {
    switch (type) {
      case 'error':
        return <ErrorMessageBox message="No information available" />;
      case 'info':
        return <InfoMessageBox message="No information available" />;
      default:
        return undefined;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Header>{children}</Header>
      {renderSwitch()}
    </div>
  );
}
