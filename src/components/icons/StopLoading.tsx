type TrashIconProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function StopLoading({ className, style }: TrashIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      color="red"
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
        <rect width={6} height={6} x={9} y={9} fill="currentColor" />
        <path
          stroke="#333"
          strokeDasharray={60}
          strokeDashoffset={60}
          strokeOpacity={0.3}
          d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0" />
        </path>
        <path
          strokeDasharray={15}
          strokeDashoffset={15}
          strokeOpacity={0.6}
          d="M12 3a9 9 0 0 1 9 9"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0" />
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </g>
    </svg>
  );
}
