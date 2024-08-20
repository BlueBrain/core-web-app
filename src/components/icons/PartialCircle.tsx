import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function PartialCircleIcon({ className, style }: Props) {
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
      <path
        d="M12 6C12 4.95249 11.7258 3.92323 11.2046 3.0146C10.6833 2.10596 9.93334 1.34961 9.02913 0.820772C8.12491 0.291933 7.098 0.00903432 6.05053 0.000212767C5.00306 -0.00860878 3.97153 0.256954 3.05853 0.77049C2.14554 1.28402 1.3829 2.02764 0.846466 2.92737C0.31003 3.82709 0.0184935 4.85159 0.000851051 5.89895C-0.0167914 6.94631 0.240075 7.98004 0.745904 8.89732C1.25173 9.81461 1.98889 10.5835 2.88407 11.1275L6 6H12Z"
        fill="currentColor"
      />
    </svg>
  );
}
