type AddThinIconProps = {
  iconColor: string;
  className?: string;
};

export default function AddThinIcon({ iconColor, className }: AddThinIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.98862 0C9.59959 0.00624949 9.28556 0.323414 9.28556 0.714002V19.286C9.28556 19.6805 9.60507 20 9.99956 20C10.394 20 10.7136 19.6805 10.7136 19.286V0.714783C10.7136 0.320275 10.394 0.000781336 9.99956 0.000781336L9.98862 0Z"
        fill={iconColor}
      />
      <path
        d="M0.714002 9.285C0.319494 9.285 0 9.60451 0 9.999C0 10.3935 0.319514 10.713 0.714002 10.713H19.2852C19.6797 10.713 19.9992 10.3935 19.9992 9.999C19.9992 9.60451 19.6797 9.285 19.2852 9.285H0.714002Z"
        fill={iconColor}
      />
    </svg>
  );
}
