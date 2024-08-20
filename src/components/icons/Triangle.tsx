import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function TriangleIcon({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.36122 1.375C7.74612 0.708334 8.70837 0.708333 9.09327 1.375L15.5885 12.625C15.9734 13.2917 15.4922 14.125 14.7224 14.125H1.73205C0.962252 14.125 0.481125 13.2917 0.866025 12.625L7.36122 1.375Z"
        fill="currentColor"
      />
    </svg>
  );
}
