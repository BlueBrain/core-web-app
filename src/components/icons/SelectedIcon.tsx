import { CSSProperties } from 'react';

type SelectedIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function SelectedIcon({
  className,
  fill = 'currentColor',
  style,
}: SelectedIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
      }}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={fill}
    >
      <rect width="14" height="14" rx="7" fill="#40A9FF" />
      <path
        d="M8.99027 5.00025C8.842 5.00471 8.70116 5.06639 8.59787 5.17267C7.70716 6.06523 7.02084 6.81362 6.20483 7.64893L5.37544 6.94737C5.26062 6.84444 5.10863 6.79204 4.95479 6.80245C4.80095 6.81286 4.65752 6.88532 4.55793 7.00311C4.45797 7.12091 4.4104 7.27401 4.42564 7.42784C4.44051 7.58131 4.51743 7.72252 4.6382 7.81838L5.87486 8.86479C6.10153 9.0569 6.43782 9.04278 6.64777 8.83209C7.6741 7.80357 8.40354 6.98338 9.40647 5.97826C9.57406 5.81401 9.62386 5.56356 9.5317 5.3473C9.43991 5.13141 9.22474 4.99355 8.99027 5.00025Z"
        fill={fill}
      />
    </svg>
  );
}
