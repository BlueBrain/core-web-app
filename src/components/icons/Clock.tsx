import { CSSProperties } from 'react';

type ClockIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ClockIcon({ className, style }: ClockIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 0C2.69991 0 0 2.69991 0 6C0 9.30009 2.69991 12 6 12C9.30009 12 12 9.30009 12 6C12 2.69991 9.30009 0 6 0ZM6.60017 6C6.60017 6.11981 6.53999 6.17999 6.53999 6.24018L5.64002 7.92032C5.46002 8.22012 5.10003 8.3405 4.80023 8.16051C4.50044 7.98051 4.38006 7.62052 4.56005 7.32073L5.39983 5.76097V3.00029C5.39983 2.6403 5.64002 2.40012 6 2.40012C6.35999 2.40012 6.60018 2.6403 6.60018 3.00029L6.60017 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
