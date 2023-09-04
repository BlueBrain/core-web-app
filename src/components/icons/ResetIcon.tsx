import { CSSProperties } from 'react';

type ResetIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ResetIcon({ className, style }: ResetIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.02941 0.75C2.77425 0.75 0.901191 2.42096 0.579044 4.58824H0L1.05882 5.91177L2.11765 4.58824H1.38143C1.69216 2.85375 3.20393 1.54412 5.02935 1.54412C7.08082 1.54412 8.73523 3.19853 8.73523 5.25C8.73523 7.30147 7.08082 8.95588 5.02935 8.95588C3.69602 8.95588 2.53012 8.25897 1.87776 7.20631L1.19532 7.60337C1.98789 8.89071 3.41011 9.75 5.02945 9.75C7.51001 9.75 9.52945 7.73056 9.52945 5.25C9.52945 2.76944 7.51001 0.75 5.02945 0.75H5.02941ZM4.63235 3.13235V5.44032L4.78125 5.56027L6.41501 6.86725L6.91134 6.24685L6.60113 5.99869L5.4265 5.0598V3.13248"
        fill="currentColor"
      />
    </svg>
  );
}
