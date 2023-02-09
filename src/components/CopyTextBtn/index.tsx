import { ReactNode, PropsWithChildren, CSSProperties, useState } from 'react';
import { captureException } from '@sentry/nextjs';

import { classNames } from '@/util/utils';

type CopyTextBtnProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
};

export default function CopyTextBtn({
  text,
  children,
  icon,
  className,
  style,
}: PropsWithChildren<CopyTextBtnProps>) {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showResult = (message: string) => {
    setStatusMsg(message);
    setTimeout(() => setStatusMsg(null), 300);
  };

  const copyToClipboard = () => {
    if (!text) return;

    try {
      navigator.clipboard.writeText(text);
      showResult('Copied');
    } catch (err) {
      showResult('Error');
      captureException(err);
    }
  };

  return (
    <button
      type="button"
      className={classNames('text-left', className)}
      style={style}
      onClick={copyToClipboard}
    >
      {icon ?? null}
      <span className="ml-2 align-middle">{statusMsg ?? children}</span>
    </button>
  );
}
