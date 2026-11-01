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

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}><path d="M6 9l6 6 6-6" /></Icon>
);

export const MoreIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="5" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="19" cy="12" r="1.6" fill="currentColor" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);

/** Square white tile with a hard black frame; the red cell sits inside the white, never on the blue. */
export function BrandMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="brand-mark">
      <rect x="1.5" y="1.5" width="41" height="41" fill="#ffffff" stroke="#000000" strokeWidth="3" />
      <rect x="8" y="15" width="11" height="14" fill="none" stroke="#000000" strokeWidth="3" />
      <rect x="25" y="15" width="11" height="14" fill="var(--neon-red)" stroke="#000000" strokeWidth="3" />
      <path d="M19 22h6" stroke="#000000" strokeWidth="3" />
    </svg>
  );
}
