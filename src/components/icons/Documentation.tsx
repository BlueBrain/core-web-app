import { CSSProperties } from 'react';

type FileIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function DocumentationIcon({ className, style }: FileIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="icn_documentation"
        d="M2.02649 5.4124C1.86961 5.4124 1.74268 5.2849 1.74268 5.12858C1.74268 4.97171 1.87017 4.84477 2.02649 4.84477H7.52706C7.68394 4.84477 7.81087 4.97227 7.81087 5.12858C7.81087 5.28546 7.68338 5.4124 7.52706 5.4124H2.02649ZM10.5603 12.1829C10.5603 12.3398 10.4328 12.4667 10.2765 12.4667C10.1196 12.4667 9.99268 12.3392 9.99268 12.1829V0.876932H1.57637V1.24501H9.26868C9.42555 1.24501 9.55249 1.3725 9.55249 1.52882V12.1829C9.55249 12.4428 9.65725 12.6784 9.82688 12.8475C9.99484 13.0154 10.2249 13.1197 10.4804 13.1224H10.4926C10.752 13.1224 10.9876 13.0171 11.1578 12.8475L11.1706 12.8353C11.333 12.6673 11.4333 12.4367 11.4333 12.1829V9.03821H10.5608V12.1829L10.5603 12.1829ZM1.00831 1.24504V0.593148C1.00831 0.436271 1.13581 0.309336 1.29213 0.309336H10.2761C10.4329 0.309336 10.5599 0.43683 10.5599 0.593148V8.47008H11.7162C11.8731 8.47008 12 8.59757 12 8.75389V12.1829C12 12.5898 11.8376 12.9601 11.5732 13.2322L11.5577 13.2489C11.2849 13.5216 10.9074 13.6907 10.4917 13.6907H1.50776C1.09312 13.6907 0.716743 13.5221 0.44346 13.2494L0.441797 13.2478C0.169067 12.9745 0 12.5975 0 12.1824V1.52832C0 1.37144 0.127494 1.24451 0.283812 1.24451H1.00776L1.00831 1.24504ZM9.31479 13.123C9.10859 12.8653 8.98498 12.5382 8.98498 12.1829V1.81266H0.568661V12.1829C0.568661 12.4429 0.673427 12.6784 0.843051 12.8475C1.01322 13.0177 1.24826 13.1225 1.50879 13.1225H9.31533L9.31479 13.123ZM2.02663 10.0909C1.86976 10.0909 1.74282 9.96341 1.74282 9.80709C1.74282 9.65021 1.87032 9.52328 2.02663 9.52328H7.5272C7.68408 9.52328 7.81101 9.65077 7.81101 9.80709C7.81101 9.96397 7.68352 10.0909 7.5272 10.0909H2.02663ZM2.02663 6.9718C1.86976 6.9718 1.74282 6.84431 1.74282 6.68799C1.74282 6.53111 1.87032 6.40418 2.02663 6.40418H7.5272C7.68408 6.40418 7.81101 6.53167 7.81101 6.68799C7.81101 6.84487 7.68352 6.9718 7.5272 6.9718H2.02663ZM2.02663 8.53107C1.86976 8.53107 1.74282 8.40357 1.74282 8.24726C1.74282 8.09038 1.87032 7.96344 2.02663 7.96344H7.5272C7.68408 7.96344 7.81101 8.09094 7.81101 8.24726C7.81101 8.40413 7.68352 8.53107 7.5272 8.53107H2.02663Z"
        fill="currentColor"
      />
    </svg>
  );
}
