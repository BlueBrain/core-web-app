import { CSSProperties } from 'react';

type FileIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function FileIcon({ className, fill, style }: FileIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill={fill || 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.88053 13H1.64134C1.02334 13 0.521118 12.4978 0.521118 11.8798V1.12031C0.521118 0.502307 1.02334 8.33112e-05 1.64134 8.33112e-05H8.04885C8.15041 8.33112e-05 8.24739 0.0407079 8.3195 0.111802L10.888 2.67824C10.9601 2.75034 10.9997 2.84734 10.9997 2.94889V11.8797C10.9997 12.4967 10.4975 13 9.88053 13ZM1.64134 0.764917C1.44533 0.764917 1.28587 0.923867 1.28587 1.12039V11.8799C1.28587 12.0759 1.44584 12.2353 1.64134 12.2353H9.87949C10.0719 12.2353 10.235 12.0723 10.235 11.8799V3.10703L7.89043 0.764969L1.64134 0.764917Z"
        fill={fill || 'currentColor'}
      />
      <path
        d="M10.6174 3.33135H8.05093C7.83968 3.33135 7.66855 3.16022 7.66855 2.94897L7.66906 0.382536C7.66906 0.228163 7.76249 0.088011 7.90519 0.0290956C8.04738 -0.0298094 8.21241 0.00218197 8.32209 0.111868L10.888 2.67824C10.9972 2.78741 11.0302 2.95201 10.9708 3.09521C10.9109 3.23791 10.7728 3.33135 10.6174 3.33135ZM8.43325 2.56659H9.69414L8.43325 1.30571V2.56659Z"
        fill={fill || 'currentColor'}
      />
      <path
        d="M8.52776 10.5214H2.99424C2.78299 10.5214 2.61186 10.3503 2.61186 10.1391C2.61186 9.92781 2.78299 9.75668 2.99424 9.75668H8.52776C8.73901 9.75668 8.91014 9.92781 8.91014 10.1391C8.91014 10.3503 8.7385 10.5214 8.52776 10.5214Z"
        fill={fill || 'currentColor'}
      />
      <path
        d="M8.52776 8.22762H2.99424C2.78299 8.22762 2.61186 8.05649 2.61186 7.84524C2.61186 7.63399 2.78299 7.46286 2.99424 7.46286H8.52776C8.73901 7.46286 8.91014 7.63399 8.91014 7.84524C8.91014 8.05649 8.7385 8.22762 8.52776 8.22762Z"
        fill={fill || 'currentColor'}
      />
      <path
        d="M8.52776 5.9334H2.99424C2.78299 5.9334 2.61186 5.76227 2.61186 5.55103C2.61186 5.33978 2.78299 5.16865 2.99424 5.16865H8.52776C8.73901 5.16865 8.91014 5.33978 8.91014 5.55103C8.91014 5.76227 8.7385 5.9334 8.52776 5.9334Z"
        fill={fill || 'currentColor'}
      />
    </svg>
  );
}
