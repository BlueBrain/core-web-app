import { CSSProperties } from 'react';

type QuoteOutlineProps = {
  className?: string;
  style?: CSSProperties;
};

function CopyIcon({ style, className }: QuoteOutlineProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width || 10}
      height={style?.height || 11}
      fill="none"
      style={style}
      className={className}
    >
      <path
        fill="#003A8C"
        fillRule="evenodd"
        d="M1.775 3.395h4.293c.638 0 1.16.523 1.16 1.161V8.85c0 .638-.522 1.161-1.16 1.161H1.775c-.638 0-1.161-.523-1.161-1.16V4.555c0-.638.523-1.16 1.16-1.16ZM4.546 0H8.84C9.477 0 10 .523 10 1.161v4.293c0 .638-.523 1.16-1.16 1.16H7.716V4.557c0-.906-.742-1.648-1.649-1.648H3.385V1.16C3.385.523 3.908 0 4.546 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default CopyIcon;
