import { ReactNode } from "react";
import { Button } from "./button";

interface ModuleCardProps {
  number: string;
  title: string;
  description: string;
  topics: string[];
  href: string;
  className?: string;
}

interface TaskBadgeProps {
  type: 'mcq' | 'practical' | 'answers';
  children: ReactNode;
}

const TaskBadge = ({ type, children }: TaskBadgeProps) => {
  const variants = {
    mcq: "bg-blue-50 text-blue-700 border-blue-200",
    practical: "bg-green-50 text-green-700 border-green-200", 
    answers: "bg-orange-50 text-orange-700 border-orange-200"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[type]}`}>
      {children}
    </span>
  );
};

export const ModuleCard = ({ number, title, description, topics, href, className = "" }: ModuleCardProps) => {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="relative bg-gradient-card border border-border rounded-2xl p-6 shadow-card group-hover:shadow-elegant group-hover:-translate-y-2 transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
            {number}
          </div>
          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h4>
        </div>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
              {topic}
            </li>
          ))}
        </ul>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <TaskBadge type="mcq">📝 MCQ Quiz</TaskBadge>
          <TaskBadge type="practical">💻 Practical Tasks</TaskBadge>
          <TaskBadge type="answers">✅ Solutions</TaskBadge>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
          asChild
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            📖 Study Module
          </a>
        </Button>
      </div>
    </div>
  );
};