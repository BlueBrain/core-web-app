import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';

import { EXPLORE_NAVIGATION_LIST } from '../../explore-section/Sidebar';
import { EyeIcon } from '../../icons';

function ExploreMainMenuItem({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return (
    <Link
      href={url}
      className="relative w-full p-7 bg-white hover:bg-primary-8 flex flex-col items-start text-left group"
    >
      <h3 className="text-xl font-bold text-primary-8 group-hover:text-white">{name}</h3>
      <p className="text-base font-normal w-1/2 line-clamp-2 text-neutral-4 group-hover:text-white">
        {description}
      </p>
      <EyeIcon className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-8 group-hover:text-white" />
    </Link>
  );
}

export default function ExploreMainMenu() {
  return (
    <div className="w-full flex flex-col items-center gap-1">
      {EXPLORE_NAVIGATION_LIST.map(({ name, description, url }) => (
        <ExploreMainMenuItem
          key={kebabCase(`main-${name}-${url}`)}
          {...{ name, description, url }}
        />
      ))}
    </div>
  );
}
