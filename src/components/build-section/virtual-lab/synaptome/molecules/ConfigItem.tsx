type Props = {
  label: string;
  value?: string | number | number[];
  unit?: string;
};

export default function ConfigItem({ label, value, unit }: Props) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="font-medium uppercase text-gray-400">{label}</div>
      <div className="text-lg font-bold capitalize text-primary-8">
        {value}
        {unit && <span className="ml-2 text-sm font-light">[{unit}]</span>}
      </div>
    </div>
  );
}
