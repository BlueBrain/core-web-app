type Props = {
  message?: string | null;
};

export default function ErrorMessageLine({ message }: Props) {
  if (!message) return null;

  return <div className="text-xs text-red-400">{message}</div>;
}
