import React from 'react';

// Centralized Pixel Art Icons
export const PixelIcon = ({ name, size = 32, color = 'currentColor' }) => {
  const icons = {
    monitor: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M0 2h16v10H9v2h3v2H4v-2h3v-2H0V2zm2 2v6h12V4H2z" />
      </svg>
    ),
    music: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M10 0v2h4v10c0 2.2-1.8 4-4 4s-4-1.8-4-4V4H2v8c0 2.2-1.8 4-4 4s-4-1.8-4-4V0h10z" />
      </svg>
    ),
    clapperboard: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M0 0h16v16H0V0zm2 2v2h2V2H2zm4 0v2h2V2H6zm4 0v2h2V2h-2zm4 0v2h2V2h-2zM2 6v8h12V6H2z" />
      </svg>
    ),
    gamepad: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M2 4h12v8h-2v-2h-2v2H6v-2H4v2H2V4zm2 2v2h2V6H4zm8 0v2h2V6h-2zM7 8h2v2H7V8z" />
      </svg>
    ),
    cloud: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M10 4c-2.2 0-4 1.8-4 4 0 .3 0 .7.1 1-.6-.6-1.5-1-2.4-1-1.9 0-3.5 1.6-3.5 3.5S1.8 15 3.7 15h8.6c2 0 3.7-1.7 3.7-3.7s-1.7-3.8-3.7-3.8c-.1 0-.2 0-.3.1C11.5 5.7 10.9 4 10 4z" />
      </svg>
    ),
    package: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M8 0L1 4v8l7 4 7-4V4L8 0zM3 5.5l5-2.8 5 2.8v5l-5 2.8-5-2.8v-5z" />
      </svg>
    ),
    calculator: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M2 0h12v16H2V0zm2 2v2h2V2H4zm4 0v2h2V2H8zm4 0v2h2V2h-2zM4 6v2h2V6H4zm4 0v2h2V6H8zm4 0v2h2V6h-2zM4 10v2h2v-2H4zm4 0v2h2v-2H8zm4 0v2h2v-2h-2z" />
      </svg>
    ),
    rain: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
        <path d="M8 2c-2.2 0-4 1.8-4 4 .1 1 .6 1.9 1.4 2.5C4.6 9.3 4 10.1 4 11c0 1.7 1.3 3 3 3 .3 0 .7-.1 1-.2.3.1.7.2 1 .2 1.7 0 3-1.3 3-3 0-.9-.6-1.7-1.4-2.5.8-.6 1.3-1.5 1.4-2.5 0-2.2-1.8-4-4-4zm-2 10h1v2H6v-2zm3 0h1v2H9v-2zm3-2h1v2h-1v-2zm-9 0h1v2H3v-2z" />
      </svg>
    )
  };

  return icons[name] || null;
};
