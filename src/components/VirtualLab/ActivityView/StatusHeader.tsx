export default function StatusHeader({
  error,
  build,
  running,
}: {
  error?: number;
  build?: number;
  running?: number;
}) {
  const wrap = (name: string, value?: number) => (
    <div className="flex gap-2">
      <span className="text-primary-3">{name}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
  return (
    <div className="relative bottom-20 flex gap-7">
      {wrap('Error', error)}
      {wrap('Model builds', build)}
      {wrap('Analyses runing', running)}
    </div>
  );
}
