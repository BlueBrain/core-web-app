import { CSSProperties, SVGProps } from 'react';

type EyeIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function EyeIcon({ className, style }: EyeIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="13"
      height="9"
      viewBox="0 0 13 9"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.9564 4.14387C10.6478 1.38727 8.66974 0 6.01805 0C3.36499 0 1.3883 1.38727 0.0797097 4.14525C0.0272218 4.25639 0 4.37778 0 4.50069C0 4.6236 0.0272218 4.74499 0.0797097 4.85613C1.3883 7.61273 3.36637 9 6.01805 9C8.67112 9 10.6478 7.61273 11.9564 4.85475C12.0627 4.63114 12.0627 4.37163 11.9564 4.14387V4.14387ZM6.01805 8.00614C3.79152 8.00614 2.1613 6.87699 1.01146 4.5C2.1613 2.12301 3.79152 0.993865 6.01805 0.993865C8.24459 0.993865 9.8748 2.12301 11.0246 4.5C9.87618 6.87699 8.24597 8.00614 6.01805 8.00614ZM5.96284 2.07055C4.62112 2.07055 3.53339 3.15828 3.53339 4.5C3.53339 5.84172 4.62112 6.92945 5.96284 6.92945C7.30456 6.92945 8.39229 5.84172 8.39229 4.5C8.39229 3.15828 7.30456 2.07055 5.96284 2.07055ZM5.96284 6.04601C5.10839 6.04601 4.41683 5.35445 4.41683 4.5C4.41683 3.64555 5.10839 2.95399 5.96284 2.95399C6.81729 2.95399 7.50885 3.64555 7.50885 4.5C7.50885 5.35445 6.81729 6.04601 5.96284 6.04601Z" />
    </svg>
  );
}

export function EyeIconOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112"
      />
      <circle
        cx="256"
        cy="256"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
}
