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
      className="pt-2 text-sm bg-neutral-1 text-primary-8 w-[40px] shrink-0 h-full flex flex-col items-center"
      href={href}
      prefetch={prefetch}
    >
      <ArrowRightOutlined className="rotate-180 mt-1.5 mb-4" />
      <div style={{ writingMode: 'vertical-rl', rotate: '180deg' }}>
        Back to interactive exploration
      </div>
    </Link>
  );
}
