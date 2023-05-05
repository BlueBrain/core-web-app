import React from 'react';
import { classNames } from '@/util/utils';

export type ExploreSectionDetailFieldProps = {
  title: string | React.ReactElement;
  field?: string | string[] | number | React.ReactElement | null;
  className?: string;
};

const serializeField = (field: string | string[] | number | React.ReactElement) => {
  if (Array.isArray(field)) {
    return field.join(', ');
  }
  return field;
};

export default function ExploreSectionDetailField({
  title,
  field,
  className,
}: ExploreSectionDetailFieldProps) {
  return (
    <div className={classNames('text-primary-7 text-xs mr-10', className)}>
      <div className="text-xs uppercase text-neutral-4">{title}</div>
      <div className="mt-3">
        <span>{field && serializeField(field)}</span>
      </div>
    </div>
  );
}
