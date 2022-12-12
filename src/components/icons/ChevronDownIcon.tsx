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
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.65984 3.89729L7.90306 0.621871C8.03569 0.478567 8.03164 0.255209 7.89449 0.11646C7.7569 -0.0218363 7.53538 -0.0259352 7.39328 0.107816L4.39999 3.12575L1.40669 0.107816C1.33947 0.0391235 1.24744 -8.05235e-08 1.1518 -8.16639e-08C1.05616 -8.28044e-08 0.964129 0.0391235 0.896914 0.107816C0.756153 0.249757 0.756153 0.479939 0.896914 0.62188L4.15953 3.8973C4.29848 4.03423 4.52044 4.03423 4.65984 3.8973L4.65984 3.89729Z"
        fill="#40A9FF"
      />
    </svg>
  );
}
