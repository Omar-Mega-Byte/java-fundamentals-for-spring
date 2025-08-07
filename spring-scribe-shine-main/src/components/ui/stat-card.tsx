import { ReactNode } from "react";

interface StatCardProps {
  number: string;
  label: string;
  icon?: ReactNode;
}

export const StatCard = ({ number, label, icon }: StatCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      <div className="relative bg-gradient-card p-6 rounded-xl border border-border shadow-card group-hover:shadow-elegant transition-all duration-300">
        {icon && <div className="text-primary mb-2">{icon}</div>}
        <div className="text-3xl font-bold text-primary mb-2">{number}</div>
        <div className="text-muted-foreground font-medium">{label}</div>
      </div>
    </div>
  );
};