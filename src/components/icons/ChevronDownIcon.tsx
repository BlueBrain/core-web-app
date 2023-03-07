import { CSSProperties } from 'react';

type ChevronDownIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ChevronDownIcon({ className, style }: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="8"
      height="6"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.616667 0.609091C0.538889 0.681818 0.5 0.790909 0.5 0.863636C0.5 0.936363 0.538889 1.04545 0.616667 1.11818L1.97778 2.39091C2.13333 2.53636 2.36667 2.53636 2.52222 2.39091L3.88333 1.11818C4.03889 0.972727 4.03889 0.754545 3.88333 0.609091C3.72778 0.463636 3.49444 0.463636 3.33889 0.609091L2.25 1.66364L1.16111 0.645454C1.00556 0.463636 0.733333 0.463636 0.616667 0.609091Z"
        fill="currentColor"
      />
    </svg>
  );
}
