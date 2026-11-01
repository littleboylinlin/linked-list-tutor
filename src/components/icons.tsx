import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const PrevIcon = (props: IconProps) => (
  <Icon {...props}><path d="M15 18l-6-6 6-6" /></Icon>
);

export const NextIcon = (props: IconProps) => (
  <Icon {...props}><path d="M9 18l6-6-6-6" /></Icon>
);

export const PlayIcon = (props: IconProps) => (
  <Icon {...props}><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" /></Icon>
);

export const PauseIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const ResetIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);

/** White plate on the blue sidebar; the red cell sits inside the white, never on the blue. */
export function BrandMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="brand-mark">
      <rect width="36" height="36" rx="10" fill="#ffffff" />
      <rect x="6.5" y="13" width="9" height="10" rx="2.5" fill="none" stroke="#0b0b0c" strokeWidth="2" />
      <rect x="20.5" y="13" width="9" height="10" rx="2.5" fill="var(--neon-red)" />
      <path d="M15.5 18h5" stroke="#0b0b0c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
