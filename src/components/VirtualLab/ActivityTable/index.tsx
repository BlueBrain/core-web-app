import TableStatuses from './TableStatuses';

export default function ActivityTable() {
  return (
    <div>
      <HeaderStatuses />
      <TableStatuses />
    </div>
  );
}

const headerStatuses = [
  { name: 'Error', count: 0 },
  { name: 'Model builds', count: 0 },
  { name: 'Analysis running', count: 0 },
];

function HeaderStatuses() {
  // TODO: this numbers need to be fetched
  return (
    <div className="flex gap-7">
      {headerStatuses.map(({ name, count }) => (
        <div className="flex gap-2" key={name}>
          <span className="text-primary-3">{name}</span>
          <span className="font-bold text-white">{count}</span>
        </div>
      ))}
    </div>
  );
}
