import { usePathname } from 'next/navigation';

export default function useBasePath(key: string) {
  const splitPath = usePathname().split('/');
  const path =
    splitPath[splitPath.length - 2] === key
      ? splitPath.join('/')
      : splitPath.slice(0, splitPath.length - 1).join('/');
  const current = splitPath[splitPath.length - 2] === key ? key : splitPath.reverse()[0];
  return [path, current];
}
