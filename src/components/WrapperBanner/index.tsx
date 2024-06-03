import { getImageProps } from 'next/image';
import { ReactNode } from 'react';

import { basePath } from '@/config';

// https://nextjs.org/docs/pages/api-reference/components/image#background-css
function getBackgroundImage(srcSet = '') {
  const imageSet = srcSet
    .split(', ')
    .map((str) => {
      const [url, dpi] = str.split(' ');
      return `url("${url}") ${dpi}`;
    })
    .join(', ');
  return `image-set(${imageSet})`;
}

const imgSrc = `${basePath}/images/virtual-lab/flopped_obp_hippocampus.png`;

export default function WrapperBanner({ children }: { children: ReactNode }) {
  const {
    props: { srcSet },
  } = getImageProps({
    alt: 'Welcome Banner',
    height: 3949,
    src: imgSrc,
    width: 4096,
  });
  const backgroundImage = getBackgroundImage(srcSet);
  const style = { backgroundImage, backgroundPositionX: '55vw', backgroundSize: '145%' };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-primary-9 bg-left bg-no-repeat"
      style={style}
    >
      {children}
    </div>
  );
}
