'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import intersect from 'lodash/intersection';

import usePathname from '@/hooks/pathname';

const blackList = ['contextual', 'context', 'context-question', 'chatId'];

/**
 * this hook is created due next13 appDir missing the router events (was in next with pages dir),
 * navigating between tabs and build pages is preserving the query params,
 * so the hook is responsible to remove the query params from the blacklist,
 * so the user can ask questions without attaching to specific chat session
 */

function useLiteratureCleanNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const cleanParams = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Array.from(params.entries()).forEach(([key]) => {
      if (blackList.includes(key)) {
        params.delete(key);
      }
    });
    return params;
  }, [searchParams]);

  const cleanLiteratureNavigate = useCallback(() => {
    const items = intersect(blackList, Array.from(searchParams.keys()));
    if (items.length) {
      const params = cleanParams();
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [cleanParams, pathname, router, searchParams]);

  useEffect(() => {
    cleanLiteratureNavigate();
  }, [cleanLiteratureNavigate]);
}

export default useLiteratureCleanNavigate;
