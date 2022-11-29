import { CSSProperties } from 'react';

type CloneIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function CloneIcon({ className, style }: CloneIconProps) {
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
        d="M0 4.4543C0 4.10289 0.284585 3.81831 0.635989 3.81831H9.54573C9.89714 3.81831 10.1817 4.10289 10.1817 4.4543V13.364C10.1817 13.7154 9.89714 14 9.54573 14H0.635989C0.284585 14 0 13.7154 0 13.364V4.4543ZM1.27256 5.09088V12.7275H8.90913V5.09088H1.27256Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.81828 0.635989C3.81828 0.284585 4.10286 0 4.45427 0H13.364C13.7154 0 14 0.284585 14 0.635989V9.54573C14 9.89714 13.7154 10.1817 13.364 10.1817H11.4549V8.90916H12.7274V1.27259H5.09085V2.54515H3.81829L3.81828 0.635989Z"
        fill="currentColor"
      />
    </svg>
  );
}
