import { WarningFilled } from '@ant-design/icons';

type Props = {
  message?: string | null;
};

export default function ErrorMessageLine({ message }: Props) {
  if (!message) return null;

  return <div className="text-xs text-red-400">{message}</div>;
}

export function WarningMessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-4 rounded-md border border-warning p-16 text-xl text-warning">
      <WarningFilled style={{ fontSize: 24 }} />
      {message}
    </div>
  );
}
