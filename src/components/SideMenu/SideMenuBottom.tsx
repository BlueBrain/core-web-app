import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { HomeOutlined } from '@ant-design/icons';
import { LabItem } from '../VerticalLinks';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';

type Props = {
  lab: LabItem;
};

export default function SideMenuBottom({ lab }: Props) {
  const virtualLab = useAtomValue(virtualLabDetailAtomFamily(lab.id));
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
          }}
        >
          {virtualLab?.name}
        </Link>
        <Link href={lab.href} className="pl-[6px]">
          <HomeOutlined />
        </Link>
      </div>
    )
  );
}
