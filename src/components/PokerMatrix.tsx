import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Poker hand matrix data
const HANDS = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
  ['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
  ['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
  ['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
  ['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
  ['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
  ['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
  ['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
  ['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
  ['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
  ['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
  ['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
  ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22']
];

interface ActionButton {
  id: string;
  name: string;
  color: string;
}

interface PokerMatrixProps {
  selectedHands: Record<string, string>;
  onHandSelect: (hand: string) => void;
  activeAction: string;
  actionButtons: ActionButton[];
  readOnly?: boolean;
}

export const PokerMatrix = ({ selectedHands, onHandSelect, activeAction, actionButtons, readOnly = false }: PokerMatrixProps) => {
  const getHandColor = (hand: string) => {
    const action = selectedHands[hand];
    if (!action || action === 'fold') return 'bg-muted/50 text-muted-foreground hover:bg-muted/70';
    
    const button = actionButtons.find(b => b.id === action);
    return button ? '' : 'bg-muted/50 text-muted-foreground hover:bg-muted/70';
  };

  const getHandStyle = (hand: string) => {
    const action = selectedHands[hand];
    if (!action || action === 'fold') return {};
    
    const button = actionButtons.find(b => b.id === action);
    return button ? { backgroundColor: button.color, color: 'white' } : {};
  };

  const getPercentage = () => {
    const totalHands = 169; // Total poker hands
    const selectedCount = Object.values(selectedHands).filter(action => action && action !== 'fold').length;
    return Math.round((selectedCount / totalHands) * 100);
  };

  const getColorStats = () => {
    const totalHands = 169;
    const stats: Record<string, { count: number; percentage: number; color: string; name: string }> = {};
    
    // Initialize stats for each action button
    actionButtons.forEach(button => {
      stats[button.id] = {
        count: 0,
        percentage: 0,
        color: button.color,
        name: button.name
      };
    });
    
    // Count hands for each action
    Object.values(selectedHands).forEach(action => {
      if (action && action !== 'fold' && stats[action]) {
        stats[action].count++;
      }
    });
    
    // Calculate percentages
    Object.keys(stats).forEach(action => {
      stats[action].percentage = Math.round((stats[action].count / totalHands) * 100);
    });
    
    const totalSelected = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
    
    return { stats, totalSelected };
  };

  return (
    <div className="space-y-4">
      <div className="inline-grid grid-cols-13 gap-0.5 sm:gap-1 bg-card p-2 sm:p-4 rounded-lg border overflow-x-auto">
        {HANDS.map((row, rowIndex) => 
          row.map((hand, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              size="sm"
              className={cn(
                "h-6 w-6 sm:h-10 sm:w-10 p-0 text-[10px] sm:text-xs font-mono border transition-all duration-200 flex-shrink-0",
                getHandColor(hand),
                "hover:ring-2 hover:ring-ring"
              )}
              style={getHandStyle(hand)}
              onClick={() => !readOnly && onHandSelect(hand)}
              disabled={readOnly}
            >
              {hand}
            </Button>
          ))
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Выбрано рук:</span>
          <span className="font-mono text-lg font-bold text-primary">
            {getPercentage()}%
          </span>
        </div>
        
        {(() => {
          const { stats, totalSelected } = getColorStats();
          return (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">По действиям:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(stats).map(([actionId, stat]) => (
                  stat.count > 0 && (
                    <div key={actionId} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: stat.color }}
                        />
                        <span className="font-medium">{stat.name}</span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="text-primary font-bold">{stat.percentage}%</span>
                        <span className="text-muted-foreground ml-1">({stat.count})</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-sm">
                <span className="text-muted-foreground font-medium">Всего:</span>
                <span className="font-mono">
                  <span className="text-primary font-bold">{Math.round((totalSelected / 169) * 100)}%</span>
                  <span className="text-muted-foreground ml-1">({totalSelected} рук)</span>
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
