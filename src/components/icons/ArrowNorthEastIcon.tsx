export default function ArrowNorthEastIcon({
  iconColor,
  className,
}: {
  iconColor: string;
  className?: string;
}) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.63346 1.60998e-07L9.36335 0C9.71496 1.60998e-07 10 0.28504 10 0.636654V6.36654C10 6.71816 9.71496 7.0032 9.36335 7.0032C9.01173 7.0032 8.72669 6.71816 8.72669 6.36654V2.17367L0.900365 10L0 9.09963L7.82633 1.27331L3.63346 1.27331C3.28184 1.27331 2.9968 0.988269 2.9968 0.636654C2.9968 0.28504 3.28184 -5.3666e-08 3.63346 1.60998e-07Z"
        fill={iconColor}
      />
    </svg>
  );
}
