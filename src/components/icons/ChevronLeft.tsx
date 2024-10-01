import { CSSProperties } from 'react';

export type IconDefaultProps = {
  fill: string;
  className?: string;
  style?: CSSProperties;
};

export default function ChevronLeft({ fill, className, style }: IconDefaultProps) {
  return (
    <svg
      width="6"
      height="11"
      viewBox="0 0 6 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.77277 1.328C6.07574 1.02416 6.07574 0.531077 5.77277 0.227233C5.46892 -0.0757444 4.97584 -0.0757444 4.672 0.227233L0.227233 4.672C-0.0757445 4.97584 -0.0757445 5.46892 0.227233 5.77277L4.672 10.2175C4.97584 10.5205 5.46892 10.5205 5.77277 10.2175C6.07574 9.91369 6.07574 9.42061 5.77277 9.11676L1.87582 5.2207L5.77277 1.328Z"
        fill={fill}
      />
    </svg>
  );
}
