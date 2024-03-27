import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Session } from 'next-auth';
import { queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';

export const fetchAnalyses = async (
  session: Session,
  onSuccess: (response: Analysis[]) => void
) => {
  try {
    const response = await queryES<Analysis>(
      {
        query: {
          bool: {
            filter: [
              { term: { _deprecated: false } },
              {
                term: {
                  '@type': 'AnalysisSoftwareSourceCode',
                },
              },
            ],
          },
        },
        size: 100,
      },
      session
    );
    onSuccess(response);
  } catch (error) {
    throw new Error('Failed to fetch analyses');
  }
};

export interface Analysis {
  '@id': string;
  codeRepository: { '@id': string };
  programmingLanguage: string;
  command: string;
  commit?: string;
  branch?: string;
  subdirectory: string;
  name: string;
  targetEntity?: string;
  description: string;
}

const analysesAtom = atom<Analysis[]>([]);

export function useAnalyses(targetEntity?: string): [Analysis[], (a: Analysis[]) => void] {
  const session = useAtomValue(sessionAtom);
  const [analyses, setAnalyses] = useAtom(analysesAtom);

  useEffect(() => {
    if (!session || !targetEntity) return;
    fetchAnalyses(session, (response: Analysis[]) =>
      // TODO: Cleanup nexus data to always include targetEntity
      setAnalyses(response.filter((a) => targetEntity === a.targetEntity))
    );
  }, [session, setAnalyses, targetEntity]);
  return [analyses, setAnalyses];
}
