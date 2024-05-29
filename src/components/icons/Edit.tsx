import { CSSProperties, SVGProps } from 'react';

type EditIconProps = {
  className?: string;
  style?: CSSProperties;
};

export default function EditIcon({ className, style }: EditIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.68223e-05 0.700203C1.68223e-05 0.31368 0.313697 0 0.700219 0H7.00002V1.40039H1.40042V12.5996H12.5996V6.99999H14V13.2998C14 13.6863 13.6863 14 13.2998 14H0.700202C0.31368 14 0 13.6863 0 13.2998L1.68223e-05 0.700203Z"
        fill="currentColor"
      />
      <path d="M14 2.0487L11.9513 0L10.6021 1.3492L12.6508 3.3979L14 2.0487Z" fill="currentColor" />
      <path
        d="M5.60029 8.39974L7.85377 8.19499L11.6612 4.38755L9.61251 2.33886L5.80508 6.14629L5.60029 8.39974Z"
        fill="currentColor"
      />
    </svg>
  );
}



export function EditIconOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
        <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829c-.205.262-.38.547-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.59 4.59 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
      </g>
    </svg>
  )
}
