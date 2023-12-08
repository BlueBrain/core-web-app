import { ComponentType } from 'react';
import { signIn } from 'next-auth/react';
import kebabCase from 'lodash/kebabCase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { OBPLogo } from './Splash';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

interface BaseEntrypointMenuItem {
  title: string;
  description: string;
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
    title: 'Explore',
    description: 'Explore brain models and experimental data',
    href: '/explore/interactive',
    bgcolor: 'bg-primary-5',
  },
  {
    title: 'About',
    description: 'Documentation, release notes, roadmap',
    href: '/about',
    bgcolor: 'bg-primary-6',
  },
  {
    title: 'Login',
    description: 'Get access to all your models & experiments',
    bgcolor: 'bg-primary-7',
    action: (callbackUrl: string) =>
      signIn('keycloak', { callbackUrl: callbackUrl ?? `${basePath}/main` }),
  },
  {
    title: 'Sign up',
    href: '/sign-up',
    description: 'Create an account and start experimenting with OBP',
    bgcolor: 'bg-primary-8',
  },
];

function withButtonOrLink(WrapperComponent: ComponentType<EntrypointMenuItem>) {
  // eslint-disable-next-line react/display-name
  return function Action({ bgcolor, description, title, ...rest }: EntrypointMenuItem) {
    const key = kebabCase(`${title}-${description}`);
    const params = useSearchParams();
    if ('action' in rest && rest.action) {
      const origin = params?.get('origin');
      const callbackUrl = origin ? `${basePath}${decodeURIComponent(origin)}` : `${basePath}/main`;
      const onClick = () => () => rest.action?.(callbackUrl);
      return (
        <button key={key} type="button" aria-label={title} onClick={onClick()}>
          <WrapperComponent {...{ bgcolor, description, title }} />
        </button>
      );
    }
    if ('href' in rest) {
      return (
        <Link key={key} href={rest.href}>
          <WrapperComponent {...{ bgcolor, description, title }} />
        </Link>
      );
    }
    return null;
  };
}

function EntrypointMenuSingleItem({
  title,
  description,
  bgcolor,
}: {
  title: string;
  description: string;
  bgcolor: string;
}) {
  return (
    <div className={classNames('p-4 h-full box-border cursor-pointer hover:bg-primary-4', bgcolor)}>
      <h3 className="font-bold text-2xl text-white mb-1 text-left">{title}</h3>
      <p className="font-normal text-sm text-primary-1 line-clamp-2 text-left">{description}</p>
    </div>
  );
}

export default function EntrypointMenu() {
  return (
    <div className="grid grid-cols-[1fr_4fr] w-[calc(100%-3.25rem)] mx-auto left-7 right-7  absolute top-7 z-20">
      <OBPLogo />
      <div className="grid grid-cols-4 gap-1">
        {ENTRYPOINT_MENU_ITEMS.map((props) => withButtonOrLink(EntrypointMenuSingleItem)(props))}
      </div>
    </div>
  );
}
