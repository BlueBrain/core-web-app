import * as React from 'react';
import { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

export default function JournalIcon({ className, style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={style?.width ?? 16}
      height={style?.height ?? 16}
      fill="currentColor"
      fillRule="evenodd"
      className={className}
      style={style}
    >
      <circle cx={8} cy={8} r={7.5} stroke="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.685 11.353h-7.37c-.073 0-.133.069-.133.153v.484c0 .085.06.153.133.153h7.37c.073 0 .133-.069.133-.153v-.484c0-.084-.06-.153-.133-.153ZM11.843 5.643 8.432 3.131a.776.776 0 0 0-.864 0L4.157 5.643c-.238.175-.201.318.08.318h7.525c.282 0 .319-.143.08-.318ZM8 5.435c-.372 0-.673-.347-.673-.774 0-.428.301-.774.673-.774.372 0 .673.347.673.774 0 .427-.301.774-.673.774ZM4.72 10.39v.374h1.378v-.373c0-.156-.106-.28-.239-.291V7.215c.133-.01.24-.134.24-.29V6.55h-1.38v.374c0 .156.107.28.24.29V10.1c-.133.01-.24.135-.24.29ZM7.31 10.39v.374h1.38v-.373c0-.156-.107-.28-.24-.291V7.215c.133-.01.24-.134.24-.29V6.55H7.31v.373c0 .157.107.28.24.291V10.1c-.133.01-.24.135-.24.29ZM9.902 10.39v.374h1.379v-.373c0-.156-.106-.28-.24-.291V7.215c.134-.01.24-.134.24-.29V6.55H9.9v.373c0 .157.107.28.24.291V10.1c-.133.01-.24.135-.24.29Z"
      />
    </svg>
  );
}
