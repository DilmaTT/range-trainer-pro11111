import { useState } from "react";
import React from "react";
import { Navigation } from "@/components/Navigation";
import { UserMenu } from "@/components/UserMenu";
import { RangeEditor } from "@/components/RangeEditor";
import { Training } from "@/components/Training";
import { Library } from "@/components/Library";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

  return (
    <div className="min-h-screen bg-background">
      {!isMobileMode ? (
        // Desktop Layout
        <>
          <div className="p-4 border-b bg-card">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">PokerRange Trainer</h1>
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
                <UserMenu />
              </div>
            </div>
          </div>
          {renderSection()}
        </>
      ) : (
        // Mobile Layout
        <div className="min-h-screen bg-background flex flex-col">
          <div className="p-4 border-b bg-card">
            <div className="flex items-center justify-between">
              <Navigation 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
                isMobile={true}
              />
              <div className="flex items-center gap-2">
                {!isMobileDevice && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForceMobile(false)}
                    className="flex items-center gap-1"
                  >
                    <Monitor className="h-4 w-4" />
                    ПК
                  </Button>
                )}
                <UserMenu />
              </div>
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
