import React, { CSSProperties } from 'react';

type TSendIconProps = {
  className?: string;
  style?: CSSProperties;
};
function SendIcon({ style, className }: TSendIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width ?? 16}
      height={style?.height ?? 16}
      fill="none"
      style={style}
      className={className}
    >
      <path
        fill="currentColor"
        d="M15.414.586a1.995 1.995 0 0 0-2-.497L1.407 3.782A1.965 1.965 0 0 0 0 5.623a1.975 1.975 0 0 0 1.28 1.932l2.099.806-.337 2.682a1.71 1.71 0 0 0 1.698 1.926c.074 0 .142 0 .217-.011l2.681-.338.806 2.099a1.97 1.97 0 0 0 1.858 1.28h.074a1.977 1.977 0 0 0 1.841-1.406l3.693-12.011A1.995 1.995 0 0 0 15.414.58v.005Zm-10.6 11.24a.565.565 0 0 1-.474-.166.583.583 0 0 1-.165-.474l.297-2.401 1.978.76.76 1.978-2.401.297.006.006ZM14.82 2.25l-3.694 12.011a.826.826 0 0 1-.788.6c-.286.006-.664-.125-.824-.548l-1.95-5.071 2.556-2.556a.57.57 0 1 0-.806-.806L6.76 8.436l-5.066-1.95a.842.842 0 0 1-.548-.823.831.831 0 0 1 .6-.789l12.011-3.693a.838.838 0 0 1 .858.211.831.831 0 0 1 .211.852l-.005.006Z"
      />
    </svg>
  );
}
export default SendIcon;
