import { ReactNode } from 'react';

export default function VirtualLabStatistic({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: number | string | ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <div className="flex items-center gap-1">
        <div>{icon}</div>
        <div className="text-primary-3">{title}</div>
      </div>

      <div className="font-bold">{detail}</div>
    </div>
  );
}
