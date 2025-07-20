import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeSection: 'editor' | 'training' | 'library';
  onSectionChange: (section: 'editor' | 'training' | 'library') => void;
  isMobile?: boolean;
}

export const Navigation = ({ activeSection, onSectionChange, isMobile = false }: NavigationProps) => {
  const sections = [
    { id: 'editor' as const, label: isMobile ? 'Редактор' : 'Редактор ренжей' },
    { id: 'training' as const, label: 'Тренировка' },
    { id: 'library' as const, label: isMobile ? 'Чарт' : 'Библиотека' }
  ];

  return (
    <nav className="flex items-center gap-1 bg-card p-2 rounded-lg border">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "poker" : "ghost"}
          size="sm"
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "transition-all duration-200",
            activeSection === section.id && "shadow-md"
          )}
        >
          {section.label}
        </Button>
      ))}
    </nav>
  );
};
