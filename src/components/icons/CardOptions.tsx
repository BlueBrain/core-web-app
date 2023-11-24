import { CSSProperties } from 'react';

type CardOptionsProps = {
  className?: string;
  style?: CSSProperties;
};

export default function CardOptions({ className, style }: CardOptionsProps) {
  return (
    <svg
      className={className}
      style={style}
      width="18"
      height="100%"
      viewBox="0 0 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.2002 4H5.8002V5.6H4.2002V4Z" fill="#8C8C8C" />
      <path d="M4.2002 10.4H5.8002V12H4.2002V10.4Z" fill="#8C8C8C" />
      <path d="M7.4002 4H9.0002V5.6H7.4002V4Z" fill="#8C8C8C" />
      <path d="M7.4002 10.4H9.0002V12H7.4002V10.4Z" fill="#8C8C8C" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.8002 0.8H3.4002C2.07471 0.8 1.0002 1.87452 1.0002 3.2V12.8C1.0002 14.1255 2.07471 15.2 3.4002 15.2H9.8002C11.1257 15.2 12.2002 14.1255 12.2002 12.8V3.2C12.2002 1.87452 11.1257 0.8 9.8002 0.8ZM3.4002 0C1.63288 0 0.200195 1.43269 0.200195 3.2V12.8C0.200195 14.5673 1.63288 16 3.4002 16H9.8002C11.5675 16 13.0002 14.5673 13.0002 12.8V3.2C13.0002 1.43269 11.5675 0 9.8002 0H3.4002Z"
        fill="#8C8C8C"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.0002 8.8H4.2002V7.2H9.0002V8.8Z"
        fill="#8C8C8C"
      />
    </svg>
  );
}
