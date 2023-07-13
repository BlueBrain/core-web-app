import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

interface NavigateToHrefProps {
  router: AppRouterInstance;
  url: string;
}
export function navigateToHref({ router, url }: NavigateToHrefProps) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return router.push(`${url}?${urlSearchParams.toString()}`);
}
