type Props = {
  message?: string | null;
};

export default function ErrorMessageLine({ message }: Props) {
  if (!message) return null;

  return <div className="text-red-400 text-xs">{message}</div>;
}
