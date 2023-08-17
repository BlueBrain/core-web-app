import { CSSProperties } from 'react';

type ArrowLeftIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function ArrowLeftIcon({ className, style }: ArrowLeftIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="9"
      height="7"
      viewBox="0 0 9 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.94203 6.39158C2.99945 6.45677 3.08364 6.49601 3.17346 6.49967C3.26329 6.50366 3.35064 6.47173 3.4144 6.41153C3.47781 6.35167 3.51162 6.26919 3.50775 6.18438C3.50353 6.09957 3.46196 6.02009 3.39292 5.96588L1.09235 3.79117H8.69601C8.86649 3.78286 9 3.64983 9 3.48853C9 3.32757 8.86649 3.19454 8.69601 3.18589H1.09235L3.39644 1.01416C3.51691 0.895104 3.51691 0.707526 3.39644 0.588468C3.33691 0.53193 3.25554 0.5 3.171 0.5C3.08646 0.5 3.00545 0.531927 2.94556 0.588468L0.0958109 3.27903L0.0961637 3.2787C0.0348721 3.33457 0 3.41139 0 3.49154C0 3.57203 0.034873 3.64886 0.0961637 3.70439L2.94203 6.39158Z"
        fill="currentColor"
      />
    </svg>
  );
}
