import { CSSProperties } from 'react';

type FullCircleIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function FullCircleIcon({ className, style }: FullCircleIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="6" fill="currentColor" />
    </svg>
  );
}
