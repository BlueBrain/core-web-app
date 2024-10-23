import { useSearchParams } from 'next/navigation';

import { OBPLogo } from './Splash';

import PrimaryButtonHome from '@/components/home/PrimaryButtonHome';
import { basePath } from '@/config';
import { classNames } from '@/util/utils';

interface MenuItemProps {
  title: string;
  bgcolor?: string;
}
interface MenuButtonProps extends MenuItemProps {
  action?: <T, RT>(input: T) => RT;
}
// interface MenuLinkProps extends MenuItemProps {
//   href: string;
// }

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
    <div className="fixed flex w-full flex-row items-center justify-between px-6 pt-6">
      <OBPLogo />
      <div className="relative flex justify-between gap-1 ">
        {/* TODO: Re-enable hidden buttons after SfN */}
        {/* <MenuLink title="Getting Started" href="#" /> */}
        <PrimaryButtonHome
          label="BlueBrain Github"
          url="https://github.com/BlueBrain"
          hasIcon
          theme="dark"
        />
        <PrimaryButtonHome
          label="BlueBrain Open data"
          url="https://registry.opendata.aws/"
          hasIcon
          theme="dark"
        />
        <PrimaryButtonHome label="About" url="/about" hasIcon={false} theme="dark" />
        <PrimaryButtonHome label="Log in" url="/log-in" hasIcon={false} theme="light" />
      </div>
    </div>
  );
}
