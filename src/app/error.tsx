'use client';

import GenericErrorFallback from '@/components/GenericErrorFallback';
import { ErrorComponentProps } from '@/types/common';

export default function Error({ error }: ErrorComponentProps) {
  return <GenericErrorFallback error={error} />;
}
