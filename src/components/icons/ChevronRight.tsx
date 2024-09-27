import { CSSProperties } from 'react';

export type IconDefaultProps = {
  fill: string;
  className?: string;
  style?: CSSProperties;
};

export default function ChevronRight({ fill, className, style }: IconDefaultProps) {
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
        d="M0.227233 1.328C-0.0757443 1.02416 -0.0757443 0.531077 0.227233 0.227233C0.531077 -0.0757444 1.02416 -0.0757444 1.328 0.227233L5.77277 4.672C6.07574 4.97584 6.07574 5.46892 5.77277 5.77277L1.328 10.2175C1.02416 10.5205 0.531078 10.5205 0.227234 10.2175C-0.0757439 9.91369 -0.0757439 9.42061 0.227233 9.11676L4.12418 5.2207L0.227233 1.328Z"
        fill={fill}
      />
    </svg>
  );
}
