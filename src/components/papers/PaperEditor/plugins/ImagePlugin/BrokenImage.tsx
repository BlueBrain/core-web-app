import { forwardRef } from 'react';
import { basePath } from '@/config';

const BrokenImage = forwardRef<HTMLImageElement>((_, ref) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      alt="broken-placeholder"
      src={`${basePath}/images/broken-image.svg`}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
    />
  );
});

BrokenImage.displayName = 'BrokenImage';

export default BrokenImage;
