import { CSSProperties } from 'react';

type UndoIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function UndoIcon({ className, style }: UndoIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="8"
      height="7"
      viewBox="0 0 8 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5.35369C8 4.55833 7.68411 3.79517 7.12116 3.23271C6.5587 2.66976 5.79562 2.35386 5.00017 2.35386H1.70789L3.20779 0.853963L2.50031 0.146484L0.146965 2.50033C0.0527328 2.59407 0 2.72102 0 2.85382C0 2.98662 0.0527316 3.11357 0.146965 3.20731L2.50031 5.56115L3.20779 4.85368L1.70789 3.35377H5.00017C5.53041 3.35377 6.03917 3.5647 6.41408 3.93967C6.78899 4.31465 6.99998 4.8234 6.99998 5.35358V6.35352H7.99991L8 5.35369Z"
        fill="#434343"
      />
    </svg>
  );
}
