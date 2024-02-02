import { ArrowRightOutlined } from '@ant-design/icons';

import Link from '@/components/Link';
import { INTERACTIVE_PATH } from '@/constants/explore-section/paths';

type Props = {
  href?: string;
  prefetch?: boolean;
};

export default function BackToInteractiveExplorationBtn({
  href = INTERACTIVE_PATH,
  prefetch = true,
}: Props) {
  return (
    <Link
      className="flex h-full w-[40px] shrink-0 flex-col items-center bg-neutral-1 pt-2 text-sm text-primary-8"
      href={href}
      prefetch={prefetch}
    >
      <ArrowRightOutlined className="mb-4 mt-1.5 rotate-180" />
      <div style={{ writingMode: 'vertical-rl', rotate: '180deg' }}>
        Back to interactive exploration
      </div>
    </Link>
  );
}
