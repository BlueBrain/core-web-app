import * as React from 'react';
import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function CitationIcon({ className, style }: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style}>
      <path
        d="M6.29981 12.4951C5.1912 12.4951 4 11.5092 4 9.66094C4 7.68916 4.94498 6.23165 6.66967 5.53281C6.89589 5.45099 7.14216 5.55367 7.22397 5.77908C7.30579 6.0053 7.20311 6.25157 6.9777 6.33338C5.23215 7.05214 4.8623 8.53052 4.8623 9.65999C4.8623 10.9539 5.58106 11.6318 6.29981 11.6318C6.9568 11.6318 7.73733 11.3237 7.73733 10.4614C7.73733 10.1124 7.55282 9.78354 7.24479 9.57818C6.99853 9.43459 6.71053 9.39367 6.50517 9.51641C6.29981 9.61909 6.03268 9.53727 5.93 9.33191C5.82732 9.12655 5.90915 8.85942 6.11451 8.75674C6.60704 8.51047 7.20307 8.55138 7.69561 8.85942C8.24991 9.20836 8.59886 9.8044 8.59886 10.4614C8.5788 11.6526 7.63459 12.4951 6.29981 12.4951Z"
        fill="currentColor"
      />
      <path
        d="M11.701 12.4951C10.5923 12.4951 9.40114 11.5092 9.40114 9.66094C9.40114 7.68916 10.3461 6.23165 12.0708 5.53281C12.297 5.45099 12.5433 5.55367 12.6251 5.77908C12.7069 6.0053 12.6043 6.25157 12.3788 6.33338C10.6333 7.03127 10.2634 8.53052 10.2634 9.65999C10.2634 10.9539 10.9822 11.6318 11.701 11.6318C12.3579 11.6318 13.1385 11.3237 13.1385 10.4614C13.1385 10.1124 12.954 9.78354 12.6459 9.57818C12.3997 9.43459 12.1117 9.39367 11.9063 9.51641C11.701 9.61909 11.4338 9.53727 11.3311 9.33191C11.2285 9.12655 11.3103 8.85942 11.5156 8.75674C12.0082 8.51047 12.6042 8.55138 13.0968 8.85942C13.6511 9.20836 14 9.8044 14 10.4614C13.9799 11.6526 13.0357 12.4951 11.701 12.4951Z"
        fill="currentColor"
      />
      <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="currentColor" />
    </svg>
  );
}
