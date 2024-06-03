// TODO: this numbers need to be fetched
const headerData = [
  { name: 'Error', count: 0 },
  { name: 'Model builds', count: 0 },
  { name: 'Analysis running', count: 0 },
];

export default function StatusHeader() {
  return (
    <div className="flex gap-7">
      {headerData.map(({ name, count }) => (
        <div className="flex gap-2" key={name}>
          <span className="text-primary-3">{name}</span>
          <span className="font-bold text-white">{count}</span>
        </div>
      ))}
    </div>
  );
}
