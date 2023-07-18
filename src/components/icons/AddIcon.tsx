import { CSSProperties } from 'react';

type EyeIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function AddIcon({ className, fill = '#434343', style }: EyeIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.99204 0C6.71972 0.00437464 6.49989 0.22639 6.49989 0.499801V13.5002C6.49989 13.7764 6.72355 14 6.99969 14C7.27583 14 7.49949 13.7763 7.49949 13.5002V0.500348C7.49949 0.224193 7.27583 0.000546935 6.99969 0.000546935L6.99204 0Z" />
      <path d="M0.499801 6.4995C0.223646 6.4995 0 6.72316 0 6.9993C0 7.27544 0.22366 7.4991 0.499801 7.4991H13.4996C13.7758 7.4991 13.9994 7.27544 13.9994 6.9993C13.9994 6.72316 13.7758 6.4995 13.4996 6.4995H0.499801Z" />
    </svg>
  );
}
