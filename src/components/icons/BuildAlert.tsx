import { CSSProperties } from 'react';

type BuildAlertProps = {
  className?: string;
  style?: CSSProperties;
};

export default function BuildAlertIcon({ className, style }: BuildAlertProps) {
  return (
    <svg
      className={className}
      style={style}
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.82494 0.293054L0.151106 6.91012C-0.154523 7.46722 -0.0247936 8 0.8014 8H7.79591C8.62378 8 8.75182 7.46726 8.4462 6.91012L4.69639 0.310679C4.6204 0.162067 4.50999 -0.00208639 4.27573 2.00626e-05C4.02678 0.00463804 3.90293 0.144441 3.82485 0.293054H3.82494ZM3.81528 2.41144H4.67506V5.42066H3.81528V2.41144ZM3.81528 6.0655H4.67506V6.92528H3.81528V6.0655Z"
        fill="#F5222D"
      />
    </svg>
  );
}
