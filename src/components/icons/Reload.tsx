import { CSSProperties } from 'react';

type ReloadIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ReloadIcon({ className, style }: ReloadIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.05767 5.14274H0.912435C0.394458 5.14274 0.178726 5.6425 0.285739 5.99996L2.35986 9.80169C2.61032 10.1261 3.03607 10.1256 3.35426 9.67362L5.42838 5.99997C5.53596 5.55428 5.3208 5.14275 4.80168 5.14275H3.78907C4.16531 3.05493 5.91055 1.71449 7.99997 1.71449C10.3633 1.71449 12.2855 3.63663 12.2855 6C12.2855 8.36337 10.5716 10.2855 7.99997 10.2855V12C11.4282 12 14 9.30877 14 6C14 2.69123 11.3076 0 7.99997 0C4.97403 0 2.46335 2.15164 2.05753 5.14275"
        fill="currentColor"
      />
    </svg>
  );
}
