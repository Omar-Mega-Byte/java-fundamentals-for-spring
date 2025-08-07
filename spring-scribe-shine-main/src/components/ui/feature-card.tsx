import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="relative bg-gradient-card p-6 rounded-xl border border-border shadow-card group-hover:shadow-elegant group-hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};