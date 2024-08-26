import { useParams } from 'next/navigation';
import { isType } from './type-guards';

/**
 * @returns Value of the current URL param `projectId`, or `null` if not available.
 */
export function useParamProjectId(): string | null {
  const params = useParams();
  return isType<{ projectId: string }>(params, { projectId: 'string' }) ? params.projectId : null;
}

/**
 * @returns Value of the current URL param `virtualLabId`, or `null` if not available.
 */
export function useParamVirtualLabId(): string | null {
  const params = useParams();
  return isType<{ virtualLabId: string }>(params, { virtualLabId: 'string' })
    ? params.virtualLabId
    : null;
}
