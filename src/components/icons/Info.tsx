import * as React from 'react';
import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};
export default function InfoIcon({ className, style }: Props) {
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
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.025 0c-2.207 0-4 1.794-4 4s1.793 4 4 4c2.206 0 4-1.794 4-4s-1.794-4-4-4Zm0 7.133A3.137 3.137 0 0 1 .892 4 3.137 3.137 0 0 1 4.025.867 3.137 3.137 0 0 1 7.157 4a3.137 3.137 0 0 1-3.132 3.133Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.025 3.41a.431.431 0 0 0-.43.43v1.97c0 .236.194.43.43.43s.43-.194.43-.43V3.84a.431.431 0 0 0-.43-.43ZM4.555 2.434a.53.53 0 1 1-1.06 0 .53.53 0 0 1 1.06 0Z"
      />
    </svg>
  );
}
