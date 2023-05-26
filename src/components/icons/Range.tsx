import { CSSProperties } from 'react';

type RangeIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function RangeIcon({ className, style }: RangeIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
        height: '1em',
      }}
      height="10"
      width="14"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.17229 5.41614C-0.05743 5.18642 -0.05743 4.81397 0.17229 4.58425L3.9158 0.840747C4.14552 0.611027 4.51797 0.611027 4.74769 0.840747C4.97741 1.07047 4.97741 1.44292 4.74769 1.67264L2.00836 4.41196H11.9916L9.25231 1.67264C9.02259 1.44292 9.02259 1.07047 9.25231 0.840747C9.48203 0.611027 9.85448 0.611027 10.0842 0.840747L13.8277 4.58425C14.0574 4.81397 14.0574 5.18642 13.8277 5.41614L10.0842 9.15965C9.85448 9.38937 9.48203 9.38937 9.25231 9.15965C9.02259 8.92993 9.02259 8.55748 9.25231 8.32776L11.9916 5.58843H2.00836L4.74769 8.32776C4.97741 8.55748 4.97741 8.92993 4.74769 9.15965C4.51797 9.38937 4.14552 9.38937 3.9158 9.15965L0.17229 5.41614Z"
        fill="currentColor"
      />
    </svg>
  );
}
