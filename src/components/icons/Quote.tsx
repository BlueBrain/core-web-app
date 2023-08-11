import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function QuoteIcon({ className, style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width ?? 16}
      height={style?.height ?? 16}
      fill="currentColor"
      fillRule="evenodd"
      className={className}
      style={style}
    >
      <circle cx={8} cy={8} r={7.5} stroke="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.911 7.5c.162-.294.457-.611.958-.913a.44.44 0 0 0-.39-.788c-.855.375-2.277 1.31-2.277 3.249 0 .87.7 1.57 1.57 1.57a1.563 1.563 0 0 0 .14-3.117ZM6.036 7.5c.162-.294.457-.611.958-.913a.44.44 0 0 0-.39-.788c-.848.375-2.27 1.31-2.27 3.249 0 .87.7 1.57 1.562 1.57.862 0 1.57-.7 1.57-1.57 0-.81-.627-1.474-1.43-1.548Z"
      />
    </svg>
  );
}
