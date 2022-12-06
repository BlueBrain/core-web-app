import { CSSProperties } from 'react';

type ArrowRightIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ArrowRightIcon({ className, style }: ArrowRightIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
        height: '1em',
      }}
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.7987 3.57498L7.39939 0.175672C7.16517 -0.0585572 6.78641 -0.0585572 6.5635 0.175672C6.32927 0.4099 6.32927 0.788661 6.5635 1.01157L8.95973 3.4078H0.979948C0.656914 3.4078 0.38916 3.67511 0.38916 3.99858C0.38916 4.32162 0.656468 4.58937 0.979948 4.58937H8.94881L6.5635 6.9856C6.32927 7.21983 6.32927 7.59859 6.5635 7.8215C6.67495 7.93295 6.83081 8 6.98711 8C7.14296 8 7.28794 7.94427 7.41072 7.8215L10.8214 4.41083C10.9328 4.29937 10.9999 4.14352 10.9999 3.98722C10.9773 3.84267 10.9102 3.68638 10.7988 3.57493L10.7987 3.57498Z"
        fill="currentColor"
      />
    </svg>
  );
}
