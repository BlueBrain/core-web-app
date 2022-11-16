import { CSSProperties } from 'react';

type NavPlusIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function NavPlusIcon({ className, style }: NavPlusIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99342 0C5.75999 0.00374985 5.57156 0.194056 5.57156 0.428418V11.5721C5.57156 11.8088 5.76328 12.0005 5.99998 12.0005C6.23668 12.0005 6.4284 11.8088 6.4284 11.5721V0.428887C6.4284 0.192173 6.23668 0.000468821 5.99998 0.000468821L5.99342 0Z"
        fill="white"
      />
      <path
        d="M0.428419 5.57123C0.191704 5.57123 0 5.76294 0 5.99964C0 6.23635 0.191716 6.42806 0.428419 6.42806H11.5716C11.8083 6.42806 12 6.23635 12 5.99964C12 5.76294 11.8083 5.57123 11.5716 5.57123H0.428419Z"
        fill="white"
      />
    </svg>
  );
}
