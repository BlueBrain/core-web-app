import { CSSProperties } from 'react';

type UserOutlinedIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function UserOutlinedIcon({ className, style }: UserOutlinedIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 6C10 7.10457 9.10457 8 8 8C6.89543 8 6 7.10457 6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6ZM8 7C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.00019 10.9864L5 9.49196C5 8.69231 5.4368 8.04644 5.98788 7.63538C6.53886 7.2244 7.25354 7 8 7C8.74646 7 9.46114 7.2244 10.0121 7.63538C10.5632 8.04644 11 8.69219 11 9.49183L10.9999 11.0027L5.00019 10.9864ZM6.00158 9.43196C6.00053 9.45182 6 9.47178 6 9.49183L6.00006 9.98911L9.99998 10L10 9.49183C10 9.31939 9.96077 9.15378 9.88862 8.99969C9.61601 8.41759 8.87338 8 8 8C7.13176 8 6.39274 8.41268 6.11625 8.98942C6.04955 9.12855 6.00977 9.27722 6.00158 9.43196Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="currentColor"
      />
    </svg>
  );
}
