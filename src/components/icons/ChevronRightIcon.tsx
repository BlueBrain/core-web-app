import { CSSProperties } from 'react';

type ChevronRightIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ChevronRightIcon({ className, style }: ChevronRightIconProps) {
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
        d="M0.109091 4.13333C0.181818 4.21111 0.290909 4.25 0.363636 4.25C0.436364 4.25 0.545455 4.21111 0.618182 4.13333L1.89091 2.77222C2.03636 2.61667 2.03636 2.38333 1.89091 2.22778L0.618182 0.866667C0.472727 0.711111 0.254545 0.711111 0.109091 0.866667C-0.0363636 1.02222 -0.0363636 1.25556 0.109091 1.41111L1.16364 2.5L0.145455 3.58889C-0.0363636 3.74444 -0.0363636 4.01667 0.109091 4.13333Z"
        fill="currentColor"
      />
    </svg>
  );
}
