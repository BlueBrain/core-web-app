import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';

import { Member } from './types';
import { virtualLabApi } from '@/config';
import authFetch from '@/authFetch';
import { useUnwrappedValue } from '@/hooks/hooks';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import { VirtualLabMember } from '@/types/virtual-lab/members';
import { Project } from '@/types/virtual-lab/projects';
import { useParamProjectId, useParamVirtualLabId } from '@/util/params';
import useNotification from '@/hooks/notifications';
import { logError } from '@/util/logger';

/**
 *
 * @returns
 * * `null` if there is no current project in this context.
 * * `undefined` if there is no project with the current id.
 * * Otherwise, the details of the current project is returned.
 */
export function useCurrentProject(): Project | null | undefined {
  const virtualLabId = useParamVirtualLabId();
  const projectId = useParamProjectId();
  const data = virtualLabProjectDetailsAtomFamily({
    virtualLabId: virtualLabId ?? '',
    projectId: projectId ?? '',
  });
  const projectDetails = useUnwrappedValue(data);
  if (!virtualLabId || !projectId) return null;

  return projectDetails;
}

export function useCurrentProjectUsers(): VirtualLabMember[] {
  const virtualLabId = useParamVirtualLabId() ?? '';
  const projectId = useParamProjectId() ?? '';
  const users = useAtomValue(unwrap(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })));
  return users ?? [];
}

export function useInviteHandler(
  members: Member[],
  onClose: () => void
): {
  loading: boolean;
  handleInvite: () => void;
} {
  const notif = useNotification();
  const virtualLabId = useParamVirtualLabId();
  const projectId = useParamProjectId();
  const [loading, setLoading] = useState(false);
  const handleInvite = useCallback(() => {
    const action = async () => {
      setLoading(true);
      try {
        for (const member of members) {
          const response = await authFetch(
            `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}/invites`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: member.email,
                role: member.role,
              }),
            }
          );
          if (!response.ok) {
            notif.error(`Unable to invite "${member.email}"!`);
            logError(await response.text());
          }
        }
      } catch (ex) {
        notif.error('An error prevented us from inviting new members!');
        logError(ex);
      } finally {
        setLoading(false);
      }
    };
    action().then(onClose).catch(onClose);
  }, [members, notif, onClose, projectId, virtualLabId]);
  return { loading, handleInvite };
}
