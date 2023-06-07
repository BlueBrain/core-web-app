/* eslint-disable import/prefer-default-export */
import React from 'react';

export function GizmoIcon() {
  return (
    <svg
      version="1.1"
      width="128"
      viewBox="-70 -70 140 140"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        style={{ font: 'bold 12px sans-serif' }}
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="2"
      >
        <circle cx="0" cy="0" r="64" fill="#fffd" stroke="none" />
        <circle cx="0" cy="0" r="18" fill="#f33" stroke="none" />
        <circle cx="0" cy="-40" r="14" fill="#0e0" stroke="none" />
        <circle cx="0" cy="40" r="12" fill="#0e03" stroke="#0e0" />
        <circle cx="-40" cy="0" r="14" fill="#08f" stroke="none" />
        <circle cx="40" cy="0" r="12" fill="#08f3" stroke="#08f" />
        <g fill="#fff">
          <text style={{ fontSize: '18px' }}>X</text>
          <text y="-40">Y</text>
          <text x="-40">Z</text>
        </g>
      </g>
    </svg>
  );
}
