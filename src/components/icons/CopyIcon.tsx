import { CSSProperties, SVGProps } from 'react';

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
      fill="currentColor"
      fillRule="evenodd"
      style={style}
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.775 3.395h4.293c.638 0 1.16.523 1.16 1.161V8.85c0 .638-.522 1.161-1.16 1.161H1.775c-.638 0-1.161-.523-1.161-1.16V4.555c0-.638.523-1.16 1.16-1.16ZM4.546 0H8.84C9.477 0 10 .523 10 1.161v4.293c0 .638-.523 1.16-1.16 1.16H7.716V4.557c0-.906-.742-1.648-1.649-1.648H3.385V1.16C3.385.523 3.908 0 4.546 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default CopyIcon;


export function CopyIconOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <rect width="336" height="336" x="128" y="128" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" rx="57" ry="57"/>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m383.5 128l.5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"/>
    </svg>
  )
}
