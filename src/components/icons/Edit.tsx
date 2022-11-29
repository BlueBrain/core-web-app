import { CSSProperties } from 'react';

type EditIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function EditIcon({ className, style }: EditIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.68223e-05 0.700203C1.68223e-05 0.31368 0.313697 0 0.700219 0H7.00002V1.40039H1.40042V12.5996H12.5996V6.99999H14V13.2998C14 13.6863 13.6863 14 13.2998 14H0.700202C0.31368 14 0 13.6863 0 13.2998L1.68223e-05 0.700203Z"
        fill="currentColor"
      />
      <path d="M14 2.0487L11.9513 0L10.6021 1.3492L12.6508 3.3979L14 2.0487Z" fill="currentColor" />
      <path
        d="M5.60029 8.39974L7.85377 8.19499L11.6612 4.38755L9.61251 2.33886L5.80508 6.14629L5.60029 8.39974Z"
        fill="currentColor"
      />
    </svg>
  );
}
