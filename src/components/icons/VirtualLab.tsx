import { CSSProperties } from 'react';

type VirtualLabIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function VirtualLabIcon({
  className,
  fill = 'currentColor',
  style,
}: VirtualLabIconProps) {
  return (
    <svg
      className={className}
      style={{
        ...style,
        height: '1em',
      }}
      width="15"
      height="13"
      viewBox="0 0 15 13"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.50008 1.6022e-05C5.4794 1.6022e-05 3.65009 0.223764 2.30686 0.594395C1.63498 0.780031 1.08434 1.00066 0.682509 1.26254C0.280677 1.52441 0 1.8513 0 2.25006V8.25018C0 8.69393 0.344999 9.05081 0.85064 9.33895C1.35628 9.62771 2.06316 9.86896 2.94748 10.0621C3.10311 10.0958 3.24936 9.97708 3.24998 9.81833L3.24936 3.81886C3.24998 3.70135 3.16873 3.59885 3.05435 3.57322C2.20183 3.38696 1.53307 3.15134 1.09799 2.90321C0.662908 2.65507 0.499849 2.41757 0.499849 2.25008C0.499849 2.09632 0.624225 1.89632 0.956113 1.68006C1.28799 1.46318 1.79925 1.25318 2.43926 1.07631C3.71991 0.723182 5.51676 0.500666 7.5 0.500666C9.48324 0.500666 11.2801 0.723166 12.5607 1.07631C13.2007 1.25319 13.712 1.4632 14.0439 1.68006C14.3758 1.89632 14.5001 2.09695 14.5001 2.2507C14.5001 2.41821 14.337 2.6557 13.902 2.90383C13.467 3.15196 12.7982 3.38758 11.9457 3.57384C11.8307 3.59947 11.7494 3.70197 11.75 3.81948V9.81896C11.7506 9.97771 11.8969 10.0958 12.0525 10.0627C12.9369 9.86958 13.6432 9.62769 14.1494 9.33957C14.655 9.05081 15 8.69457 15 8.2508V2.25004C15 1.85128 14.7194 1.52504 14.3175 1.26252C13.9156 1.00064 13.365 0.780015 12.6931 0.59438C11.35 0.223748 9.5206 0 7.49992 0L7.50008 1.6022e-05ZM0.499946 3.10328C0.499946 3.10328 0.641823 3.21828 0.850576 3.33702C1.30871 3.59828 1.97873 3.83454 2.74933 4.01829V9.50719C2.07932 9.33719 1.46494 9.11281 1.0981 8.90343C0.663085 8.6553 0.499962 8.41968 0.499962 8.25217L0.499946 3.10328ZM14.5002 3.10328V8.25217C14.5002 8.41968 14.3371 8.6553 13.9021 8.90343C13.5352 9.11281 12.9208 9.33719 12.2508 9.50719V4.01829C13.0215 3.83516 13.6915 3.5989 14.1496 3.33702C14.3584 3.21827 14.5002 3.10328 14.5002 3.10328Z"
        fill="currentColor"
      />
      <path
        d="M7.00007 2.24998C6.17442 2.24998 5.49941 2.925 5.49941 3.75063C5.49941 4.57626 6.17444 5.24941 7.00007 5.24941C7.8257 5.24941 8.50072 4.57628 8.50072 3.75063C8.50072 2.92498 7.8257 2.24998 7.00007 2.24998ZM7.00007 2.74999C7.55509 2.74999 8.00009 3.19499 8.00009 3.75001C8.00009 4.30503 7.55509 4.75003 7.00007 4.75003C6.44505 4.75003 6.00005 4.30503 6.00005 3.75001C6.00005 3.19499 6.44505 2.74999 7.00007 2.74999Z"
        fill="currentColor"
      />
      <path d="M6.75063 9.25011V12.2508H7.24876V9.25011H6.75063Z" fill="currentColor" />
      <path
        d="M8.99883 4.00313V4.87253L7.93193 5.50004H5.75061C5.75061 5.50004 5.44748 5.49629 5.1381 5.65129C4.82872 5.8063 4.49934 6.13505 4.49934 6.74944V7.98759C4.49309 8.39885 4.8281 8.74387 5.23935 8.74948C5.65936 8.75573 6.00625 8.40698 5.99999 7.98759V6.50757H5.49936V7.99509C5.50123 8.13947 5.3906 8.25197 5.24623 8.24946C5.10498 8.24759 4.99685 8.13571 4.99872 7.99509L4.99935 6.74944C4.99935 6.37256 5.1706 6.19318 5.36123 6.09818C5.55185 6.00318 5.75061 6.00068 5.75061 6.00068H8.00009C8.04447 6.00006 8.0876 5.98818 8.12572 5.96568L9.37699 5.23317C9.45324 5.18754 9.49949 5.10567 9.49887 5.01753V3.99564C9.497 3.85439 9.612 3.74252 9.74638 3.74127C9.88388 3.73939 10.0033 3.8519 10.0008 3.99564V5.38941L8.31016 7.33633C8.27079 7.38196 8.24891 7.44008 8.24953 7.5007V11.2509C8.24953 11.6346 8.07828 11.8071 7.88765 11.9021C7.69703 11.9971 7.50014 11.9996 7.50014 11.9996H6.50012C6.50012 11.9996 6.30324 11.9971 6.11261 11.9021C5.92198 11.8071 5.75073 11.6265 5.75073 11.2509V8.45208H5.25072V11.2502C5.25072 11.8715 5.57948 12.1934 5.88949 12.3484C6.19887 12.5034 6.50012 12.4996 6.50012 12.4996L7.50014 12.5002C7.50014 12.5002 7.8014 12.504 8.11078 12.349C8.42016 12.194 8.74954 11.8715 8.74954 11.2508V7.59269L10.4384 5.64769C10.4784 5.60206 10.5009 5.54394 10.5009 5.48332V4.00329C10.5071 3.58391 10.1584 3.23702 9.74273 3.24265C9.32709 3.24828 8.99272 3.59203 8.99897 4.00329L8.99883 4.00313Z"
        fill="currentColor"
      />
      <path
        d="M8.73819 7.27888C9.91571 7.33575 11.0226 7.47451 11.9514 7.67764L12.0582 7.18887C11.1626 6.99261 10.1208 6.85887 9.01323 6.79386L8.73819 7.27888Z"
        fill="currentColor"
      />
      <path
        d="M4.71875 6.90063C4.08373 6.97251 3.48873 7.06814 2.94688 7.18689L3.05188 7.67565C3.57376 7.5619 4.15564 7.4669 4.77559 7.39689L4.71875 6.90063Z"
        fill="currentColor"
      />
    </svg>
  );
}
