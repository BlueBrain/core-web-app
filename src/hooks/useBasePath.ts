import { usePathname } from 'next/navigation';

/**
 * Given a key, returns the path up to that key and the current page parameter
 *
 * Example1:
 *
 * If pathname = /virtual/myvl/project/myproject and key = project
 * then path = /virtual/myvl/project and current = myproject
 *
 * Example2:
 *
 * If pathname = /virtual/myvl/project and key = project
 * then path = /virtual/myvl/project and current = project
 *
 *
 * @param key
 * @returns
 */
export default function useBasePath(key: string) {
  const splitPath = usePathname().split('/');
  const path =
    splitPath[splitPath.length - 2] === key
      ? splitPath.join('/')
      : splitPath.slice(0, splitPath.length - 1).join('/');
  const currentPage = splitPath[splitPath.length - 2] === key ? key : splitPath.reverse()[0];
  return [path, currentPage];
}
