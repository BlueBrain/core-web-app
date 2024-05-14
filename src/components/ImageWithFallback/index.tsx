import Image, { ImageProps } from 'next/image';
import { ReactEventHandler, SyntheticEvent, useEffect, useState } from 'react';

interface ImageWithFallbackProps extends ImageProps {
  fallback: ImageProps['src'];
}

export default function ImageWithFallback({
  fallback,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState<React.SyntheticEvent<HTMLImageElement, Event> | null>(null);

  const onError: ReactEventHandler<HTMLImageElement> = (
    e: SyntheticEvent<HTMLImageElement, Event>
  ) => setError(e);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={onError}
      src={error ? fallback : src}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}
