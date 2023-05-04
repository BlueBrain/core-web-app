'use client';

import { classNames } from '@/util/utils';
import { defaultPadding } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  className?: string;
};

export default function DefaultEmptyParam({ className }: Props) {
  return <div className={classNames(defaultPadding, className)}>---</div>;
}
