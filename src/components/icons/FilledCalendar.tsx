import { CSSProperties } from 'react';

type FilledCalendarIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function FilledCalendar({ className, style }: FilledCalendarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      style={style}
      width="13"
      height="12"
    >
      <path
        fill="currentColor"
        d="M2.846 7.385c0-.255.207-.462.462-.462h2.307a.462.462 0 1 1 0 .923H3.308a.462.462 0 0 1-.462-.461ZM7.923 6.923a.462.462 0 1 0 0 .923h2.308a.461.461 0 1 0 0-.923H7.923Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.538 1.846C.538.826 1.365 0 2.385 0h8.769C12.174 0 13 .827 13 1.846v8.308c0 1.02-.827 1.846-1.846 1.846h-8.77a1.846 1.846 0 0 1-1.846-1.846V1.846Zm12 1.846H1v6.462c0 .764.62 1.385 1.385 1.385h8.769c.764 0 1.385-.62 1.385-1.385V3.692Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
