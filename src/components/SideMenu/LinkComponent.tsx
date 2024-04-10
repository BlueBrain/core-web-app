import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';
import { Role } from '@/constants/virtual-labs/sidemenu';

type Props = {
  link: LinkItem;
  expanded: boolean;
  linkClassName: (link: LinkItem) => string;
};

export default function LinkComponent({ link, expanded, linkClassName }: Props) {
  if (link?.role === Role.Scale && !expanded) return null;

  return (
    <div className="flex flex-col items-start" key={link.key}>
      {expanded && (
        <span className="text-md mt-4 font-thin uppercase text-primary-4">{link.label}</span>
      )}
      <Link href={link.href} className={linkClassName(link)}>
        {link.content}
        {expanded && <ArrowRightOutlined className="ml-2 text-primary-1" />}
      </Link>
    </div>
  );
}
