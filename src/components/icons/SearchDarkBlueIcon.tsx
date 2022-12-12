import { CSSProperties } from 'react';

type SearchDarkBlueIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function SearchDarkBlueIcon({ className, style }: SearchDarkBlueIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.8607 7.21158L5.44945 4.79989C5.82031 4.31295 6.029 3.68688 6.029 3.01428C6.029 1.34475 4.68425 0 3.01472 0C1.34519 0 0 1.34519 0 3.01472C0 4.68425 1.34475 6.029 3.01428 6.029C3.68688 6.029 4.28946 5.82031 4.79989 5.44945L7.21158 7.86114C7.30419 7.95375 7.42027 8.00027 7.53636 8.00027C7.65245 8.00027 7.76809 7.95375 7.86114 7.86114C8.04636 7.67549 8.04636 7.39724 7.86071 7.21159L7.8607 7.21158ZM3.01472 5.10163C1.85518 5.10163 0.927813 4.17427 0.927813 3.01472C0.927813 1.85518 1.85518 0.927813 3.01472 0.927813C4.17427 0.927813 5.10163 1.85518 5.10163 3.01472C5.10163 4.17382 4.17383 5.10163 3.01472 5.10163Z"
        fill="#0050B3"
      />
    </svg>
  );
}
