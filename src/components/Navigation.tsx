import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react"; // Import React

interface NavigationProps {
  activeSection: 'editor' | 'training' | 'library';
  onSectionChange: (section: 'editor' | 'training' | 'library') => void;
  isMobile?: boolean;
  mobileActions?: React.ReactNode; // New prop for mobile actions
}

export const Navigation = ({ activeSection, onSectionChange, isMobile = false, mobileActions }: NavigationProps) => {
  const sections = [
    { id: 'editor' as const, label: 'Редактор' },
    { id: 'training' as const, label: 'Тренировка' },
    { id: 'library' as const, label: 'Чарт' }
  ];

  return (
    <nav className="flex items-center gap-1 bg-card border w-full"> {/* Removed p-1 and rounded-lg */}
      <div className="flex items-center gap-1"> {/* Wrap buttons in a div for consistent spacing */}
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
      </div>
      {isMobile && mobileActions} {/* Render mobile actions if in mobile mode */}
    </nav>
  );
};
