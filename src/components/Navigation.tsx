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

  const content = (
    <>
      <div className="flex items-center gap-1"> {/* Wrap buttons in a div for consistent spacing */}
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "poker" : "ghost"}
            size="sm"
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "transition-all duration-200",
              activeSection === section.id && "shadow-md",
              isMobile && "h-10" // Уменьшаем высоту для мобильного режима
            )}
          >
            {section.label}
          </Button>
        ))}
      </div>
      {isMobile && mobileActions} {/* Render mobile actions if in mobile mode */}
    </>
  );

  if (isMobile) {
    return content; // Directly return content without the nav wrapper for mobile
  }

  return (
    <nav className="flex items-center gap-1 bg-card border w-full"> {/* Removed p-1 and rounded-lg */}
      {content}
    </nav>
  );
};
