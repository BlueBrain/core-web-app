import { CSSProperties } from 'react';

type BuildValidatedProps = {
  className?: string;
  style?: CSSProperties;
};

export default function BuildValidatedIcon({ className, style }: BuildValidatedProps) {
  return (
    <svg
      className={className}
      style={style}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 0C2.93897 0 1.92188 0.421386 1.17138 1.17138C0.421386 1.92187 0 2.939 0 4C0 5.42925 0.76221 6.74949 1.99999 7.46386C3.23778 8.17871 4.76224 8.17871 5.99998 7.46386C7.23777 6.74952 7.99998 5.42925 7.99998 4C7.99998 2.93897 7.57859 1.92188 6.82859 1.17138C6.07811 0.421386 5.06097 0 3.99998 0H4ZM3.55761 5.76761L1.96724 4.17636L2.67477 3.46884L3.55855 4.35262L5.32617 2.5865L6.03369 3.29403L3.55761 5.76761Z"
        fill="#389E0D"
      />
    </svg>
  );
}
