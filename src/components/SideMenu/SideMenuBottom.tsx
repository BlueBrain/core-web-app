import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';

type Props = {
  lab?: LinkItem;
};

export default function SideMenuBottom({ lab }: Props) {
  return (
    lab && (
      <div className="absolute bottom-0 z-20 mb-4 mt-auto flex w-[calc(100%-2.5rem)] flex-col items-center justify-center bg-primary-9 text-primary-3">
        <Link
          key={lab.key}
          href={lab.href}
          className="capitalize"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            cursor: 'e-resize',
          }}
        >
          {lab.content}
        </Link>
        <Link href={lab.href} className="pl-[6px]">
          <HomeOutlined />
        </Link>
      </div>
    )
  );
}
