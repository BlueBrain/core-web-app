import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { OBPLogo } from './Splash';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

interface MenuItemProps {
  title: string;
  bgcolor?: string;
}
interface MenuButtonProps extends MenuItemProps {
  action?: <T, RT>(input: T) => RT;
}
interface MenuLinkProps extends MenuItemProps {
  href: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MenuButton({ bgcolor, title, action }: MenuButtonProps) {
  const params = useSearchParams();
  const origin = params?.get('origin');
  const callbackUrl = origin ? `${basePath}${decodeURIComponent(origin)}` : `${basePath}/main`;

  return (
    <button type="button" aria-label={title} onClick={() => action?.(callbackUrl)}>
      <MenuItem {...{ bgcolor, title }} />
    </button>
  );
}

function MenuLink({ bgcolor, title, href }: MenuLinkProps) {
  return (
    <Link href={href}>
      <MenuItem {...{ bgcolor, title }} />
    </Link>
  );
}

const defaultBgColor = 'bg-primary-8';

function MenuItem({ title, bgcolor = defaultBgColor }: MenuItemProps) {
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
        {/* TODO: Re-enable hidden buttons after SfN */}
        {/* <MenuLink title="Getting Started" href="#" /> */}
        <MenuLink title="About" href="/about" />
        {/* <MenuLink title="Log in" href="/log-in" /> */}
      </div>
    </div>
  );
}
