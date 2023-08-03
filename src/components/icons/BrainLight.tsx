import { CSSProperties } from 'react';

type BrainLightProps = {
  className?: string;
  style?: CSSProperties;
};

function BrainLight({ style, className }: BrainLightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width ?? 18}
      height={style?.height ?? 16}
      fill="none"
      style={style}
      className={className}
    >
      <path
        fill="#003A8C"
        d="m15.086 8.771.471-.711 1.283.85-.471.71-1.283-.849ZM15.19 2.931l1.285-.857.475.713-1.285.857-.476-.713ZM16.286 5.431H18v.858h-1.714V5.43ZM1.046 2.788l.476-.713 1.286.857-.476.713-1.286-.857ZM1.048 8.933l1.286-.857.475.713-1.285.857-.476-.713ZM0 5.431h1.714v.858H0V5.43ZM13.626 4.463a1.89 1.89 0 0 0-1.482-2.434A1.823 1.823 0 0 0 9 1.359a1.822 1.822 0 0 0-3.141.665A1.891 1.891 0 0 0 4.376 4.46a2.142 2.142 0 0 0 0 2.785A1.89 1.89 0 0 0 5.86 9.678c.097.349.295.66.57.896v1.714c0 .71.576 1.286 1.285 1.286v.857a.856.856 0 0 0 .857.857h.858a.857.857 0 0 0 .857-.857v-.857c.71 0 1.286-.576 1.286-1.286v-1.714c.27-.23.47-.535.57-.876a1.89 1.89 0 0 0 1.482-2.434 2.142 2.142 0 0 0 0-2.786l.002-.015ZM9.43 14.43H8.57v-.857h.858v.857Zm1.285-2.142a.428.428 0 0 1-.428.428H7.714a.428.428 0 0 1-.428-.428v-1.316A1.813 1.813 0 0 0 9 10.36a1.816 1.816 0 0 0 1.714.62v1.309Zm1.79-5.246.051.05v.002a1.03 1.03 0 0 1-1.198 1.65v.428a.965.965 0 0 1-1.928 0v-.527c0-.237.191-.429.428-.429h.666a.403.403 0 0 0 .406-.405v-.045a.403.403 0 0 0-.406-.407h-.666c-.71 0-1.286.576-1.286 1.286v.535a.965.965 0 0 1-1.928 0v-.428a1.02 1.02 0 0 1-1.45-1.213c.124.025.251.037.378.034h.667a.403.403 0 0 0 .405-.405v-.045a.402.402 0 0 0-.405-.407H5.57a.857.857 0 0 1-.857-.857c0-.516.308-.98.782-1.183l-.051-.05v-.002a1.03 1.03 0 0 1 1.198-1.65v-.428a.965.965 0 0 1 1.928 0v.313a.428.428 0 0 1-.428.429h-.666a.403.403 0 0 0-.406.405v.045a.403.403 0 0 0 .406.407h.666a.409.409 0 0 1 .428.405v1.545a.402.402 0 0 0 .406.407h.045a.403.403 0 0 0 .407-.405v-3.56a.965.965 0 0 1 1.928 0v.43a1.02 1.02 0 0 1 1.45 1.212 1.746 1.746 0 0 0-.379-.034h-.666a.403.403 0 0 0-.405.405v.045a.403.403 0 0 0 .405.407h.666a.857.857 0 0 1 .858.857c0 .516-.308.981-.782 1.183Z"
      />
    </svg>
  );
}

export default BrainLight;
