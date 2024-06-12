import { ComponentType } from 'react';
import { useSearchParams } from 'next/navigation';
import kebabCase from 'lodash/kebabCase';
import Link from 'next/link';

import { OBPLogo } from './Splash';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

interface BaseEntrypointMenuItem {
  title: string;
  bgcolor: string;
}
interface EntrypointMenuItemAsButton extends BaseEntrypointMenuItem {
  action?: (input: any) => any;
}
interface EntrypointMenuItemAsLink extends BaseEntrypointMenuItem {
  href: string;
}
type EntrypointMenuItem = EntrypointMenuItemAsButton | EntrypointMenuItemAsLink;

const ENTRYPOINT_MENU_ITEMS: Array<EntrypointMenuItem> = [
  {
    title: 'Getting started',
    href: '#',
    bgcolor: 'bg-primary-8',
  },
  {
    title: 'About',
    href: '/about',
    bgcolor: 'bg-primary-8',
  },
  {
    title: 'Log in',
    href: '/log-in',
    bgcolor: 'bg-primary-8',
  },
];

function withButtonOrLink(WrapperComponent: ComponentType<EntrypointMenuItem>) {
  // eslint-disable-next-line react/display-name
  return function Action({ bgcolor, title, ...rest }: EntrypointMenuItem) {
    const key = kebabCase(`${title}`);
    const params = useSearchParams();
    if ('action' in rest && rest.action) {
      const origin = params?.get('origin');
      const callbackUrl = origin ? `${basePath}${decodeURIComponent(origin)}` : `${basePath}/main`;
      const onClick = () => () => rest.action?.(callbackUrl);
      return (
        <button key={key} type="button" aria-label={title} onClick={onClick()}>
          <WrapperComponent {...{ bgcolor, title }} />
        </button>
      );
    }
    if ('href' in rest) {
      return (
        <Link key={key} href={rest.href}>
          <WrapperComponent {...{ bgcolor, title }} />
        </Link>
      );
    }
    return null;
  };
}
function EntrypointMenuSingleItem({ title, bgcolor }: { title: string; bgcolor: string }) {
  return (
    <div
      className={classNames(
        'box-border h-auto w-[168px] cursor-pointer py-4 hover:bg-primary-4',
        bgcolor
      )}
    >
      <h3 className="my-auto pl-8 text-left text-xl font-semibold text-white">{title}</h3>
    </div>
  );
}

export default function EntrypointMenu() {
  return (
    <div className="absolute left-7 right-7 top-7 z-20 mx-auto grid w-[calc(100%-3.25rem)] grid-cols-[1fr_3fr]">
      <OBPLogo />
      <div className="absolute right-7 top-7 flex justify-between gap-1">
        {ENTRYPOINT_MENU_ITEMS.map((props) => withButtonOrLink(EntrypointMenuSingleItem)(props))}
      </div>
    </div>
  );
}
