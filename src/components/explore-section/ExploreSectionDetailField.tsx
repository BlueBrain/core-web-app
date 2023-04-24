import React from 'react';
import { classNames } from '@/util/utils';

type ExploreSectionDetailFieldProps = {
  title: string | React.ReactElement;
  field?: string | string[] | number | React.ReactElement | null;
  textAfterField?: string;
  className?: string[];
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
  textAfterField,
  className = [],
}: ExploreSectionDetailFieldProps) {
  return (
    <div className={classNames([...className].join(' '), 'text-primary-7 text-xs mr-10')}>
      <div className="text-xs uppercase text-neutral-4">{title}</div>
      <div className="mt-3">
        <span className="capitalize">{field && serializeField(field)}</span>
        {field && textAfterField && <span className="text-neutral-4"> {textAfterField}</span>}
      </div>
    </div>
  );
}
