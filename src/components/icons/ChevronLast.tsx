import { CSSProperties } from 'react';

type Props = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function ChevronLast({ className, fill, style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...{ className, fill, style }}
    >
      <path
        fill="currentColor"
        d="M7.414 5L6 6.414l5.657 5.657L6 17.728l1.414 1.414l7.071-7.07zm8.929 14V5h2v14z"
      />
    </svg>
  );
}
