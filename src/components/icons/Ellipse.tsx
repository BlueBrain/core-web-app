import { CSSProperties } from 'react';

type EllipseIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function EllipseIcon({ className, style }: EllipseIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="25"
      height="25"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50%" cy="50%" r="3" fill="currentColor" />
    </svg>
  );
}
