import { atomFamily, selectAtom } from 'jotai/utils';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { ClassNexus } from '@/api/ontologies/types';

export const meTypeDetailsAtom = atomFamily((resourceId: string) =>
  selectAtom(
    sessionAtom,
    (session) =>
      session &&
      (fetchResourceById(resourceId, session, {
        org: 'neurosciencegraph',
        project: 'datamodels',
      }) as Promise<ClassNexus>)
  )
);
