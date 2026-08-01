import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps = {
  "aria-hidden": true,
  fill: "none",
  focusable: false,
  viewBox: "0 0 24 24",
} as const;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m6 15 6-6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M4 8h16M4 16h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-1.57-.02-3.45.39-5.2l1.28-5.43s-.32-.65-.32-1.62c0-1.52.88-2.65 1.98-2.65.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.9 3.64-.26 1.09.55 1.98 1.63 1.98 1.95 0 3.45-2.06 3.45-5.03 0-2.63-1.89-4.47-4.59-4.47-3.13 0-4.96 2.35-4.96 4.77 0 .94.36 1.96.82 2.51.09.11.1.2.08.32l-.3 1.23c-.05.2-.16.24-.37.15-1.38-.64-2.24-2.66-2.24-4.28 0-3.48 2.53-6.69 7.29-6.69 3.83 0 6.8 2.73 6.8 6.37 0 3.8-2.4 6.86-5.72 6.86-1.12 0-2.17-.58-2.53-1.27l-.69 2.62c-.25.96-.92 2.16-1.37 2.89.8.25 1.64.38 2.51.38A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
