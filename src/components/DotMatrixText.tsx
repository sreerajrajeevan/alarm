import { cn } from "@/lib/utils";

interface DotMatrixTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span';
}

export function DotMatrixText({ children, className, as: Component = 'div' }: DotMatrixTextProps) {
  return (
    <Component className={cn("font-headline dot-matrix uppercase", className)}>
      {children}
    </Component>
  );
}
