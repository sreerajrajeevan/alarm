import { cn } from "@/lib/utils";

interface NothingCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NothingCard({ children, className, onClick }: NothingCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card p-6 rounded-2xl transition-all duration-300",
        onClick && "cursor-pointer active:scale-[0.98] hover:bg-white/[0.05]",
        className
      )}
    >
      {children}
    </div>
  );
}
