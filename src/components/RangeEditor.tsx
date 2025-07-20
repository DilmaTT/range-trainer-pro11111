import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PokerMatrix, getCombinations, TOTAL_POKER_COMBINATIONS } from "./PokerMatrix"; // Import helpers
import { Plus, Palette, Trash2 } from "lucide-react"; // Removed Download, Upload
import { cn } from "@/lib/utils";
import { useRangeContext } from "@/contexts/RangeContext";

interface ActionButton {
  id: string;
  name: string;
  color: string;
}

interface Range {
  id: string;
  name: string;
  hands: Record<string, string>;
}

interface Folder {
  id: string;
  name: string;
  ranges: Range[];
}

interface RangeEditorProps {
  isMobileMode?: boolean;
}

export const RangeEditor = ({ isMobileMode = false }: RangeEditorProps) => {
  const [editingButton, setEditingButton] = useState<string | null>(null);
  const { folders, setFolders, actionButtons, setActionButtons } = useRangeContext();
  
  const [selectedRange, setSelectedRange] = useState<string>(folders[0]?.ranges[0]?.id || '');
  const [activeAction, setActiveAction] = useState(actionButtons[0]?.id || 'raise');

  const getCurrentRangeAndFolder = () => {
    for (const folder of folders) {
      const range = folder.ranges.find(r => r.id === selectedRange);
      if (range) return { folder, range };
    }
    return { folder: folders[0], range: folders[0]?.ranges[0] };
  };

  const updateRangeName = (rangeId: string, newName: string) => {
    setFolders(prev => prev.map(folder => ({
      ...folder,
      ranges: folder.ranges.map(range => 
        range.id === rangeId ? { ...range, name: newName } : range
      )
    })));
  };

  const updateFolderName = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    ));
  };

  const addFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: 'Folder',
      ranges: []
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const addRange = (folderId: string) => {
    const newRange: Range = {
      id: Date.now().toString(),
      name: 'Range',
      hands: {}
    };
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, ranges: [...folder.ranges, newRange] }
        : folder
    ));
  };

  const deleteRange = (rangeId: string) => {
    setFolders(prev => prev.map(folder => ({
      ...folder,
      ranges: folder.ranges.filter(range => range.id !== rangeId)
    })));
    if (selectedRange === rangeId) {
      // Find first available range
      for (const folder of folders) {
        const firstRange = folder.ranges.find(r => r.id !== rangeId);
        if (firstRange) {
          setSelectedRange(firstRange.id);
          break;
        }
      }
    }
  };

  const addActionButton = () => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
    const usedColors = actionButtons.map(b => b.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || '#6b7280';
    
    const newButton: ActionButton = {
      id: Date.now().toString(),
      name: 'Action',
      color: availableColor
    };
    setActionButtons(prev => [...prev, newButton]);
  };

  const updateActionButton = (id: string, field: 'name' | 'color', value: string) => {
    setActionButtons(prev => prev.map(button => 
      button.id === id ? { ...button, [field]: value } : button
    ));
  };

  const deleteActionButton = (id: string) => {
    if (actionButtons.length > 1) {
      setActionButtons(prev => prev.filter(button => button.id !== id));
      if (activeAction === id) {
        setActiveAction(actionButtons[0].id);
      }
    }
  };

  // Removed exportRanges function
  // Removed importRanges function

  const onHandSelect = (hand: string) => {
    const { range: currentRange } = getCurrentRangeAndFolder();
    if (!currentRange) return;

    const newHands = { ...currentRange.hands };
    if (newHands[hand] === activeAction) {
      delete newHands[hand];
    } else {
      newHands[hand] = activeAction;
    }

    setFolders(prev => prev.map(folder => ({
      ...folder,
      ranges: folder.ranges.map(range => 
        range.id === currentRange.id ? { ...range, hands: newHands } : range
      )
    })));
  };

  const { folder: currentFolder, range: currentRange } = getCurrentRangeAndFolder();

  const getSelectedCombinationsCount = () => {
    if (!currentRange) return 0;
    let count = 0;
    Object.entries(currentRange.hands).forEach(([hand, action]) => {
      if (action && action !== 'fold') {
        count += getCombinations(hand);
      }
    });
    return count;
  };

  const getSelectedCombinationsPercentage = () => {
    const selectedCount = getSelectedCombinationsCount();
    return TOTAL_POKER_COMBINATIONS > 0 ? Math.round((selectedCount / TOTAL_POKER_COMBINATIONS) * 100) : 0;
  };

  return (
    <div className={cn(
      "bg-background",
      isMobileMode ? "flex flex-col" : "flex h-screen"
    )}>
      {/* Sidebar */}
      <div className={cn(
        "bg-card p-4 space-y-4",
        isMobileMode ? "order-2 flex flex-col" : "w-80 border-r" // Added flex flex-col for mobile ordering
      )}>
        {/* Action Buttons */}
        <div className={cn(
          "space-y-3 border-t pt-4",
          isMobileMode ? "order-1" : "" // Order 1 for mobile
        )}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Действия</h3>
            <Button size="sm" variant="outline" onClick={addActionButton}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className={cn(
            "space-y-2",
            isMobileMode && "grid grid-cols-2 gap-2"
          )}>
            {actionButtons.map((button) => (
              <div key={button.id} className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activeAction === button.id ? "default" : "outline"}
                  onClick={() => setActiveAction(button.id)}
                  style={{ backgroundColor: activeAction === button.id ? button.color : undefined }}
                  className="flex-1 min-w-0"
                >
                  {editingButton === button.id ? (
                    <Input
                      value={button.name}
                      onChange={(e) => updateActionButton(button.id, 'name', e.target.value)}
                      onBlur={() => setEditingButton(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingButton(null);
                        }
                      }}
                      className="h-5 text-xs border-none bg-transparent p-0 focus:bg-background text-center w-full"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingButton(button.id);
                      }}
                      className="cursor-text truncate px-1"
                    >
                      {button.name}
                    </span>
                  )}
                </Button>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={button.color}
                    onChange={(e) => updateActionButton(button.id, 'color', e.target.value)}
                    className="w-6 h-6 rounded border cursor-pointer"
                  />
                  {actionButtons.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteActionButton(button.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Removed Import/Export buttons */}
        </div>

        {/* Folder section */}
        <div className={cn(
          "space-y-4", // Keep original spacing for consistency
          isMobileMode ? "order-2" : "" // Order 2 for mobile
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Добавить папку</h2>
            <Button size="sm" onClick={addFolder} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className={cn(
            "space-y-2 overflow-y-auto",
            isMobileMode ? "max-h-64" : "max-h-96"
          )}>
            {folders.map((folder) => (
              <Card key={folder.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Input
                    value={folder.name}
                    onChange={(e) => updateFolderName(folder.id, e.target.value)}
                    className={cn(
                      "h-6 text-sm border-none bg-transparent p-0 focus:bg-background",
                      isMobileMode && "max-w-[50vw]"
                    )}
                    maxLength={isMobileMode ? 12 : 8}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => addRange(folder.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-1 ml-4">
                  {folder.ranges.map((range) => (
                      <div
                        key={range.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded cursor-pointer",
                          selectedRange === range.id ? "bg-primary/10" : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedRange(range.id)}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingButton(range.id);
                          }}
                          className={cn(
                            "cursor-text text-xs flex-1 truncate",
                            isMobileMode && "max-w-[50vw]"
                          )}
                        >
                          {editingButton === range.id ? (
                            <Input
                              value={range.name}
                              onChange={(e) => updateRangeName(range.id, e.target.value)}
                              onBlur={() => setEditingButton(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingButton(null);
                                }
                              }}
                              className="h-5 text-xs border-none bg-transparent p-0 focus:bg-background"
                              maxLength={isMobileMode ? 12 : 8}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            range.name
                          )}
                        </span>
                        {folder.ranges.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRange(range.id);
                            }}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "p-6",
        isMobileMode ? "order-1 flex-1" : "flex-1"
      )}>
        <div className={cn(
          "mx-auto space-y-6",
          isMobileMode ? "max-w-full" : "max-w-4xl"
        )}>
          {/* Header: Folder/Range Name and Statistics */}
          <div className="flex justify-between items-end">
            <div className="text-left">
              {currentFolder && (
                <h2 className="text-base font-bold text-muted-foreground mb-px">
                  {currentFolder.name}
                </h2>
              )}
              {currentRange && (
                <h1 className="text-sm font-normal ml-1">
                  {currentRange.name}
                </h1>
              )}
            </div>

            {currentRange && (
              <div className="bg-background/80 px-2 py-1 rounded text-xs font-mono flex items-center gap-1 z-10">
                <span className="text-primary font-bold">{getSelectedCombinationsPercentage()}%</span>
                <span className="text-muted-foreground">({getSelectedCombinationsCount()})</span>
              </div>
            )}
          </div>

          {currentRange && (
            <div className={cn(
              isMobileMode && "overflow-x-auto"
            )}>
              <PokerMatrix
                selectedHands={currentRange.hands}
                onHandSelect={onHandSelect}
                activeAction={activeAction}
                actionButtons={actionButtons}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
