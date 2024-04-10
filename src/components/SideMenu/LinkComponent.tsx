import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';

type Props = {
  link: LinkItem;
  expanded: boolean;
  linkClassName: (link: LinkItem) => string;
};

export default function LinkComponent({ link, expanded, linkClassName }: Props) {
  return (
    <div className="flex w-full flex-col items-start" key={link.key}>
      {expanded && <span className="text-sm uppercase text-white">{link.label}</span>}
      <Link href={link.href} className={linkClassName(link)}>
        {link.content}
        {expanded && <ArrowRightOutlined className="ml-2" />}
      </Link>
    </div>
  );
}
