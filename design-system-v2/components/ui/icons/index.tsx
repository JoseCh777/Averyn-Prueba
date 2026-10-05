import type { SVGProps } from "react";

/* Iconos propios para lo que el set gratuito de Lineicons no trae. Mismo trazo (24 px, línea redonda). */
type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  );
}

export const InfoCircle = (p: P) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></Base>
);
export const AlertCircle = (p: P) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13" /><path d="M12 16.5h.01" /></Base>
);
export const AlertTriangle = (p: P) => (
  <Base {...p}><path d="M12 4 3 19h18L12 4Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></Base>
);
export const Fingerprint = (p: P) => (
  <Base {...p}><path d="M6 10a6 6 0 0 1 12 0v2" /><path d="M9 20c-.5-1.5-.7-3-.7-5a3.7 3.7 0 0 1 7.4 0c0 1.2.1 2.4.4 3.5" /><path d="M12 12v2.5c0 1.7.3 3.2.8 4.5" /><path d="M3.5 12.5C3.2 8 6.5 4 12 4c2.2 0 4 .6 5.4 1.7" /></Base>
);
