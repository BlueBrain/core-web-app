import Image from 'next/image';

import { basePath } from '@/config';
import Link from '@/components/Link';

export default function VirtualLab() {
  return (
    <Link href="/simulate/brain-config-selector">
      <Image
        className="mv-1"
        src={`${basePath}/images/simulate-placeholder.png`}
        alt="Virtual lab placeholder image"
        fill
      />
    </Link>
  );
}
