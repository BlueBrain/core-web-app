import * as React from 'react';
import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};
export default function PersonIcon({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width ?? 16}
      height={style?.height ?? 16}
      fill="currentColor"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 10.986V9.492c0-.8.437-1.446.988-1.857C6.538 7.225 7.254 7 8 7s1.461.224 2.012.635c.551.411.988 1.057.988 1.857v1.51l-6-.016Zm1.002-1.554L6 9.492v.497L10 10v-.508c0-.173-.04-.338-.111-.492C9.616 8.418 8.873 8 8 8c-.868 0-1.607.413-1.884.99-.066.139-.106.287-.114.442Z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
