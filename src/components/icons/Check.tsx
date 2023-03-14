import { CSSProperties } from 'react';

type CheckIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function CheckIcon({ className, fill = 'currentColor', style }: CheckIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
      }}
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.26161 0L6.89036 0.37474C5.59459 1.70038 4.20752 3.21917 2.91277 4.55931L1.06477 3.00625L0.664973 2.66482L0 3.48925L0.403882 3.82651L2.62316 5.69188L2.98623 6L3.32484 5.65857C4.7282 4.22317 6.25089 2.54193 7.63284 1.12838L8 0.749467L7.26161 0Z" />
    </svg>
  );
}
