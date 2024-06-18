import { basePath } from '@/config';

export default function BrokenImage(): JSX.Element {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
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
}
