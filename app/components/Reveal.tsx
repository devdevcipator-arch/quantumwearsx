import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export default function Reveal({ children, className }: RevealProps) {
  return (
    <div data-reveal="reveal-up" className={className}>
      {children}
    </div>
  );
}
