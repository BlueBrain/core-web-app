import { CSSProperties } from 'react';

type ChevronIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function ChevronIcon({ className, fill = 'white', style }: ChevronIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
        height: '1em',
      }}
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M-5.13617e-07 0.17949L-4.62393e-07 1.35137C-4.5891e-07 1.43105 0.0390621 1.50605 0.103125 1.55293L6.22187 5.99199L0.103125 10.4311C0.0390625 10.4779 -6.01801e-08 10.5529 -5.66969e-08 10.6326L-5.47257e-09 11.8045C-1.03314e-09 11.9061 0.115625 11.9654 0.198438 11.9061L7.79375 6.39668C8.06875 6.19668 8.06875 5.7873 7.79375 5.58886L0.198437 0.0794897C0.115625 0.0185518 -5.18057e-07 0.0779276 -5.13617e-07 0.17949Z" />
    </svg>
  );
}
