import { CSSProperties } from 'react';

type ZoomIconProps = {
  className?: string;
  style?: CSSProperties;
};

export function ZoomInIcon({ className, style }: ZoomIconProps) {
  return (
    <svg
      className={className}
      style={{
        height: '1em',
        ...style,
      }}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.77743 8.68967L7.71665 6.62845C8.21362 5.91144 8.46187 5.11234 8.46187 4.2309C8.46187 3.65755 8.35076 3.10979 8.12854 2.58724C7.90589 2.06467 7.60554 1.61372 7.22707 1.23524C6.84859 0.856765 6.39808 0.555988 5.87507 0.333766C5.35164 0.110678 4.80389 0 4.23096 0C3.65803 0 3.10985 0.110676 2.5873 0.333333C2.0643 0.555554 1.61335 0.856331 1.2353 1.23481C0.856392 1.61327 0.556049 2.06423 0.333827 2.58681C0.111172 3.1098 6.10352e-05 3.65755 6.10352e-05 4.23091C6.10352e-05 4.80382 0.111172 5.35202 0.333827 5.87458C0.556482 6.39713 0.856392 6.8481 1.2353 7.22657C1.61377 7.60461 2.06472 7.90539 2.5873 8.12805C3.1103 8.35027 3.65804 8.46181 4.23096 8.46181C5.11247 8.46181 5.91196 8.21311 6.62896 7.71616L8.69018 9.77127C8.83471 9.92404 9.01483 10 9.23141 10C9.44365 10 9.62464 9.92448 9.77524 9.77474C9.92498 9.62413 10.0001 9.44315 10.0001 9.23048C10.0001 9.01824 9.92586 8.83811 9.77743 8.68967ZM6.13288 6.13279C5.60597 6.65926 4.97188 6.92272 4.231 6.92272C3.48968 6.92272 2.85555 6.6597 2.32911 6.13279C1.8022 5.60588 1.53875 4.97179 1.53875 4.2309C1.53875 3.48958 1.8022 2.85546 2.32911 2.32902C2.85602 1.80254 3.48966 1.53822 4.231 1.53822C4.97233 1.53822 5.60644 1.80211 6.13288 2.32902C6.65979 2.85549 6.92324 3.49001 6.92324 4.2309C6.92324 4.97179 6.65979 5.6059 6.13288 6.13279Z"
        fill="currentColor"
      />
      <path
        d="M5.96188 3.84634H4.61555V2.50001C4.61555 2.44793 4.59645 2.40323 4.55826 2.36504C4.52007 2.32685 4.47493 2.30818 4.42328 2.30818H4.03874C3.98666 2.30818 3.94152 2.32684 3.90332 2.36504C3.86556 2.40323 3.84603 2.44794 3.84603 2.50001V3.84634H2.50014C2.44806 3.84634 2.40335 3.86544 2.36516 3.90364C2.32697 3.9414 2.30787 3.98653 2.30787 4.03861V4.42272C2.30787 4.47524 2.32697 4.52038 2.36516 4.55815C2.40336 4.59634 2.4485 4.615 2.50014 4.615H3.84647V5.96133C3.84647 6.01385 3.86557 6.05855 3.90376 6.09675C3.94196 6.13451 3.98709 6.15361 4.03918 6.15361H4.42373C4.47581 6.15361 4.52095 6.13452 4.5587 6.09675C4.5969 6.05856 4.616 6.01386 4.616 5.96133L4.61556 4.615H5.96189C6.01398 4.615 6.05868 4.59634 6.09687 4.55815C6.13463 4.51995 6.15416 4.47525 6.15416 4.42272V4.03861C6.15416 3.98653 6.13506 3.94139 6.09687 3.90364C6.05911 3.86544 6.01396 3.84634 5.96188 3.84634Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ZoomOutIcon({ className, style }: ZoomIconProps) {
  return (
    <svg
      className={className}
      style={{
        height: '1em',
        ...style,
      }}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.72505 8.39737L8.06744 6.73976C8.50365 6.05789 8.76494 5.25227 8.76494 4.38247C8.76494 1.96228 6.8031 0 4.38247 0C1.96228 0 0 1.96228 0 4.38247C0 6.80265 1.96184 8.76494 4.38247 8.76494C5.25185 8.76494 6.05741 8.50407 6.73976 8.06744L8.39693 9.7246C8.76369 10.0918 9.35789 10.0918 9.72463 9.7246C10.0918 9.35783 10.0918 8.76367 9.72505 8.39737ZM4.38244 7.5128C2.6536 7.5128 1.25212 6.11176 1.25212 4.38248C1.25212 2.65409 2.6536 1.25216 4.38244 1.25216C6.1116 1.25216 7.51275 2.65409 7.51275 4.38248C7.51275 6.11164 6.11171 7.5128 4.38244 7.5128Z"
        fill="currentColor"
      />
      <path
        d="M5.6347 3.75667H3.13029C2.78479 3.75667 2.5044 4.03706 2.5044 4.38256C2.5044 4.72849 2.78479 5.00888 3.13029 5.00888H5.6347C5.98106 5.00888 6.26102 4.72849 6.26102 4.38256C6.26102 4.03706 5.98106 3.75667 5.6347 3.75667Z"
        fill="currentColor"
      />
    </svg>
  );
}
