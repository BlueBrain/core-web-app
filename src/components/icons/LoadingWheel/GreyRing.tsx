import { CSSProperties, memo } from 'react';

type Props = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

function GreyRingIcon({ className, fill = '#fff', style }: Props) {
  return (
    <svg
      className={`loadingWheel ${className}`}
      style={style}
      viewBox="0 0 380 380"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M190 4C87.275 4 4 87.275 4 190C4 292.725 87.275 376 190 376C292.725 376 376 292.725 376 190C376 87.275 292.725 4 190 4ZM0 190C0 85.0659 85.0659 0 190 0C294.934 0 380 85.0659 380 190C380 294.934 294.934 380 190 380C85.0659 380 0 294.934 0 190Z"
        fill="#D9D9D9"
      />
    </svg>
  );
}

export default memo(GreyRingIcon);
