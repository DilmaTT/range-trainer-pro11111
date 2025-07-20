import { useState } from "react";
import React from "react";
import { Navigation } from "@/components/Navigation";
import { UserMenu } from "@/components/UserMenu";
import { RangeEditor } from "@/components/RangeEditor";
import { Training } from "@/components/Training";
import { Library }
 from "@/components/Library";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Monitor, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeSection, setActiveSection] = useState<'editor' | 'training' | 'library'>('editor');
  const [forceMobile, setForceMobile] = useState(false);
  const isMobileDevice = useIsMobile();
  const isMobileMode = forceMobile || isMobileDevice;

  const renderSection = () => {
    switch (activeSection) {
      case 'editor':
        return <RangeEditor isMobileMode={isMobileMode} />;
      case 'training':
        return <Training isMobileMode={isMobileMode} />;
      case 'library':
        return <Library isMobileMode={isMobileMode} />;
      default:
        return <RangeEditor isMobileMode={isMobileMode} />;
    }
  };

  const mobileHeaderActions = (
    <div className="flex items-center gap-2 ml-auto"> {/* Added ml-auto to push to right */}
      {/* Version Switch Toggles */}
      <Toggle
        variant="outline"
        size="sm"
        pressed={isMobileMode}
        onPressedChange={() => setForceMobile(true)}
        className={cn(
          "flex items-center justify-center",
          isMobileMode ? "opacity-100" : "opacity-50",
          isMobileMode && "h-10" // Уменьшаем высоту для мобильного режима
        )}
      >
        <Smartphone className="h-4 w-4" />
      </Toggle>
      <Toggle
        variant="outline"
        size="sm"
        pressed={!isMobileMode}
        onPressedChange={() => setForceMobile(false)}
        className={cn(
          "flex items-center justify-center",
          !isMobileMode ? "opacity-100" : "opacity-50",
          isMobileMode && "h-10" // Уменьшаем высоту для мобильного режима
        )}
      >
        <Monitor className="h-4 w-4" />
      </Toggle>
      <UserMenu isMobileMode={isMobileMode} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {!isMobileMode ? (
        // Desktop Layout
        <>
          <div className="p-4 border-b bg-card">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Navigation 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection} 
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForceMobile(!forceMobile)}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Мобильный режим
                </Button>
                <UserMenu isMobileMode={isMobileMode} />
              </div>
            </div>
          </div>
          {renderSection()}
        </>
      ) : (
        // Mobile Layout
        <div className="min-h-screen bg-background flex flex-col">
          <div className="px-4 border-b bg-card"> {/* Changed p-4 to px-4 */}
            <div className="flex items-center justify-between">
              <Navigation 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
                isMobile={true}
                mobileActions={mobileHeaderActions} // Pass mobile actions here
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {renderSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
