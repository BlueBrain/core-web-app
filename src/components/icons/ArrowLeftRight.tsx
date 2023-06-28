import { CSSProperties } from 'react';

type ArrowLeftRightIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ArrowLeftRightIcon({ className, style }: ArrowLeftRightIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="26"
      height="8"
      viewBox="0 0 26 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.91014 8.99219L0.981934 4.99219L7.91014 0.992188V4.29937H17.09V0.992188L24.0182 4.99219L17.09 8.99219V5.68501H7.91014V8.99219Z"
        fill="white"
      />
    </svg>
  );
}
