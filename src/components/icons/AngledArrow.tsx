import { CSSProperties } from 'react';

type AngledArrowIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function AngledArrowIcon({ className, style }: AngledArrowIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.59499e-05 5.46199V0.204281C1.59499e-05 0.204281 1.64458e-05 0.123805 0.0696587 0.0608732C0.136722 -7.87159e-08 0.199659 0 0.199659 0H1.3026C1.3026 0 1.38669 -9.44591e-08 1.44601 0.0557135C1.52235 0.12742 1.52184 0.214599 1.52184 0.214599V4.1378H8.82349L7.61635 2.93067C7.53949 2.8538 7.53949 2.72845 7.61635 2.65158L8.41285 1.85508C8.48972 1.77821 8.61507 1.77821 8.69194 1.85508L11.5865 4.74911C11.6273 4.78987 11.6458 4.84506 11.6433 4.89871C11.6458 4.95236 11.6278 5.00756 11.5865 5.04832L8.69247 7.94235C8.61561 8.01922 8.49025 8.01922 8.41338 7.94235L7.61688 7.14585C7.54002 7.06899 7.54002 6.94364 7.61688 6.86676L8.82402 5.65962H0.19764C0.0887912 5.65962 6.12903e-05 5.57038 6.12903e-05 5.46204L1.59499e-05 5.46199Z"
        fill="#69C0FF"
      />
    </svg>
  );
}
