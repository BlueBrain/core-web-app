import { ComponentType } from 'react';
import { signIn } from 'next-auth/react';
import { kebabCase } from 'lodash/fp';
import Link from 'next/link';

import { classNames } from '@/util/utils';

interface BaseEntrypointMenuItem {
  title: string;
  description: string;
  bgcolor: string;
}
interface EntrypointMenuItemAsButton extends BaseEntrypointMenuItem {
  action?: () => any;
}
interface EntrypointMenuItemAsLink extends BaseEntrypointMenuItem {
  href: string;
}
type TEntrypointMenuItem = EntrypointMenuItemAsButton | EntrypointMenuItemAsLink;

const ENTRYPOINT_MENU_ITEMS: Array<TEntrypointMenuItem> = [
  {
    title: 'Discover',
    description: 'Explore brain models and experimental data',
    href: '/discover',
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
    action: () => signIn('keycloak', { callbackUrl: '/main' }),
  },
  {
    title: 'Sign-up',
    href: '/sign-up',
    description: 'Create an account and start experimenting with OBP',
    bgcolor: 'bg-primary-8',
  },
];

function withButtonOrLink(WrapperComponent: ComponentType<TEntrypointMenuItem>) {
  // eslint-disable-next-line react/display-name
  return function Action({ bgcolor, description, title, ...rest }: TEntrypointMenuItem) {
    const key = kebabCase(`${title}-${description}`);
    if ('action' in rest && rest.action) {
      return (
        <button key={key} type="button" aria-label={title} onClick={rest.action}>
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

function EntrypointMenuItem({
  title,
  description,
  bgcolor,
}: {
  title: string;
  description: string;
  bgcolor: string;
}) {
  return (
    <div
      className={classNames('p-4 h-28 w-52 box-border cursor-pointer hover:bg-primary-4', bgcolor)}
    >
      <h3 className="font-bold text-2xl text-white mb-1 text-left">{title}</h3>
      <p className="font-normal text-sm text-primary-1 line-clamp-2 text-left">{description}</p>
    </div>
  );
}

export default function EntrypointMenu() {
  return (
    <div className="grid grid-flow-col gap-1 absolute top-7 right-7 z-20">
      {ENTRYPOINT_MENU_ITEMS.map((props) => withButtonOrLink(EntrypointMenuItem)(props))}
    </div>
  );
}
