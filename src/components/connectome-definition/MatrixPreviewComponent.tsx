import Image from 'next/image';

import { basePath } from '@/config';

export default function MatrixPreviewComponent() {
  return (
    <Image
      className="mv-1"
      src={`${basePath}/images/connectome-definition-placeholder.png`}
      alt="Connectome definition placeholder image"
      width={200}
      height={200}
    />
  );
}
