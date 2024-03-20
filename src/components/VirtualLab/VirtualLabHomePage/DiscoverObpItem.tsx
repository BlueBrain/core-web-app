import { ReactNode } from 'react';

type Props = {
  imagePath: string;
  title: string;
  body: ReactNode | string;
  buttonText: string;
  buttonHref: string;
};

export default function DiscoverObpItem({ imagePath, title, body, buttonText, buttonHref }: Props) {
  return (
    <div className="relative h-64 w-64 overflow-hidden rounded-lg bg-white">
      <img
        src={imagePath}
        alt="Circular"
        className="absolute left-1/2 top-0 h-auto w-full -translate-x-1/2 transform rounded-full border-4 border-white"
      />
    </div>
  );
}
