import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

function QuoteOutline({ style, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width || 13}
      height={style?.height || 11}
      fill="currentColor"
      fillRule="evenodd"
      style={style}
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 5.767V8.65c0 .798-.652 1.45-1.45 1.45H8.667c-.798 0-1.45-.651-1.45-1.45V5.768A5.767 5.767 0 0 1 12.983 0l.001 2.036a4.007 4.007 0 0 0-3.356 2.298h1.922c.798 0 1.45.635 1.45 1.433ZM4.333 10.1H1.45C.652 10.1 0 9.449 0 8.65V5.767A5.767 5.767 0 0 1 5.767 0v2.037A4.007 4.007 0 0 0 2.41 4.334h1.923c.798 0 1.45.652 1.45 1.45v2.883c0 .782-.651 1.434-1.45 1.434Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default QuoteOutline;
