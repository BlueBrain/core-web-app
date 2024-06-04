import { HTMLProps } from 'react';
import kebabCase from 'lodash/kebabCase';

import { classNames } from '@/util/utils';

export function FormActiveLabel({
  title,
  className,
}: {
  title: string;
  className?: HTMLProps<HTMLElement>['className'];
}) {
  return (
    <span className={classNames('mb-1 text-base font-bold text-primary-8', className)}>
      {title}
    </span>
  );
}

export function FormStaleLabel({
  title,
  className,
}: {
  title: string;
  className?: HTMLProps<HTMLElement>['className'];
}) {
  return (
    <h3 className={classNames('mb-2 text-base font-bold text-neutral-4', className)}>{title}</h3>
  );
}

export function FormError({ errors }: { errors: string[] }) {
  return errors.map((err) => (
    <div key={`error-paper-${kebabCase(err)}`} className="flex py-1 text-sm text-rose-600">
      {err}
    </div>
  ));
}
