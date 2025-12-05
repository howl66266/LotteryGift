import React, { useState } from 'react';
import { ItemType, LotteryItem, Player } from '../types';
import { TYPE_COLORS, TYPE_LABELS } from '../constants';
import { Marquee } from './Marquee';
import { Button } from './ui/Button';
import { Trophy, Skull, Zap, Forward, Ghost } from 'lucide-react';

interface GameScreenProps {
  players: Player[];
  items: LotteryItem[];
  allowRepeats: boolean;
  onFinishGame: (finalPlayers: Player[]) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ players, items, allowRepeats, onFinishGame }) => {
  // Game Logic State
  const [currentItems, setCurrentItems] = useState<LotteryItem[]>(items);
  const [playerList, setPlayerList] = useState<Player[]>(players);
  const [turnIndex, setTurnIndex] = useState(0);
  
  // Animation State
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<LotteryItem | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const currentPlayer = playerList[turnIndex];

  // Helper to get random item
  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * currentItems.length);
    return currentItems[randomIndex];
  };

  const hasPlayerWonPrize = (player: Player) => {
    return player.history.some(item => item.type === ItemType.PRIZE);
  };

  const handleSpin = () => {
    if (isSpinning || currentItems.length === 0) return;

    // 1. Decide the winner immediately (Deterministic)
    const selectedItem = getRandomItem();
    setWinner(selectedItem);
    
    // 2. Start Animation
    setIsSpinning(true);
    setShowResultModal(false);
  };

  const handleSpinEnd = () => {
    // Show modal after spin stops
    // Add a tiny delay to ensure the visual lock is perceived
    setTimeout(() => {
        setShowResultModal(true);
    }, 300);
  };

  const confirmResult = () => {
    if (!winner || !currentPlayer) return;

    // 1. Update Player History
    const updatedPlayers = [...playerList];
    updatedPlayers[turnIndex].history.push(winner);
    setPlayerList(updatedPlayers);

    // 2. Handle Item Removal Logic
    let nextItems = currentItems;
    if (winner.type !== ItemType.PENALTY) {
      // Remove Prize, Chance, Skip, Boss from pool
      nextItems = currentItems.filter(i => i.id !== winner.id);
      setCurrentItems(nextItems);
    }

    // 3. Reset State for next turn
    setIsSpinning(false);
    setShowResultModal(false);
    setWinner(null); // Clear winner so Marquee goes back to idle state
    
    // 4. Calculate Turn Rotation & End Game Conditions
    const remainingRemovables = nextItems.filter(i => i.type !== ItemType.PENALTY);
    
    // Check if any players are left to play (if no repeats allowed)
    // A player is "active" if they haven't won a prize (if repeats disabled) OR if repeats allowed (always active)
    let activePlayerCount = updatedPlayers.length;
    if (!allowRepeats) {
        activePlayerCount = updatedPlayers.filter(p => !hasPlayerWonPrize(p)).length;
    }

    // Game Ends if no prizes/removables left OR no active players left
    if (remainingRemovables.length === 0 || activePlayerCount === 0) {
        onFinishGame(updatedPlayers);
        return;
    }

    // Find next eligible player
    let nextIndex = (turnIndex + 1) % updatedPlayers.length;
    
    if (!allowRepeats) {
        // Skip players who have already won a PRIZE
        let loopCount = 0;
        // While the next player has won a prize, skip them
        while (hasPlayerWonPrize(updatedPlayers[nextIndex]) && loopCount < updatedPlayers.length) {
            nextIndex = (nextIndex + 1) % updatedPlayers.length;
            loopCount++;
        }
    }

    setTurnIndex(nextIndex);
  };

  const getIcon = (type: ItemType) => {
    switch(type) {
      case ItemType.PRIZE: return <Trophy className="w-12 h-12 mb-4" />;
      case ItemType.PENALTY: return <Skull className="w-12 h-12 mb-4" />;
      case ItemType.CHANCE: return <Zap className="w-12 h-12 mb-4" />;
      case ItemType.SKIP: return <Forward className="w-12 h-12 mb-4" />;
      case ItemType.BOSS: return <Ghost className="w-12 h-12 mb-4" />;
    }
  };

  const getActionMessage = (item: LotteryItem) => {
    switch(item.type) {
      case ItemType.PRIZE: return "恭喜！你獲得了禮物！ 🎁";
      case ItemType.PENALTY: return "糟糕！你需要完成這個懲罰！ 📸";
      case ItemType.CHANCE: return "命運的召喚！請遵照指示！ ✨";
      case ItemType.SKIP: return "幸運日！直接跳過，換下一位。 ⏩";
      case ItemType.BOSS: return "大魔王降臨！祝你好運... 💀";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      
      {/* Top Bar: Turn Indicator */}
      <div className="flex-none p-4 text-center">
        <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-2">目前抽獎者</h2>
        <div className="inline-block bg-slate-800 border border-blue-500/30 px-8 py-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <span className="text-3xl font-black text-white">{currentPlayer?.name}</span>
        </div>
      </div>

      {/* Middle: Marquee Area */}
      <div className="flex-1 flex flex-col justify-center gap-8 py-8 relative">
        {currentItems.length > 0 ? (
           <Marquee 
             items={currentItems} 
             isSpinning={isSpinning} 
             winnerItem={winner} 
             onSpinEnd={handleSpinEnd} 
           />
        ) : (
            <div className="text-center text-2xl font-bold text-slate-500">項目已抽完！</div>
        )}
      </div>

      {/* Bottom: Controls */}
      <div className="flex-none p-8 flex justify-center pb-12">
        <Button 
          size="xl" 
          disabled={isSpinning || currentItems.length === 0} 
          onClick={handleSpin}
          className={`w-full max-w-sm h-24 text-2xl transition-all ${isSpinning ? 'opacity-50 grayscale cursor-not-allowed' : 'animate-pulse hover:animate-none shadow-blue-500/20'}`}
        >
           {isSpinning ? '抽獎中...' : '🎰 開始抽獎 !'}
        </Button>
      </div>

       {/* Result Modal Overlay */}
       {showResultModal && winner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className={`
              max-w-lg w-full bg-slate-900 border-4 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl
              animate-in zoom-in-95 slide-in-from-bottom-10 duration-500
              ${TYPE_COLORS[winner.type].replace('bg-', 'border-')}
           `}>
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent`} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`p-6 rounded-full bg-slate-950/80 mb-6 border-4 shadow-xl ${TYPE_COLORS[winner.type].replace('bg-', 'border-').split(' ')[0]} ${TYPE_COLORS[winner.type].replace('bg-', 'text-').split(' ')[0]}`}>
                    {getIcon(winner.type)}
                </div>
                
                <h3 className="text-xl font-bold uppercase tracking-widest mb-2 opacity-80">{TYPE_LABELS[winner.type]}</h3>
                <h2 className="text-4xl font-black text-white mb-6 leading-tight drop-shadow-lg">{winner.content}</h2>
                
                <div className="bg-slate-950/60 p-6 rounded-xl mb-8 w-full border border-white/10 shadow-inner">
                  <p className="text-xl text-slate-200 font-medium">{getActionMessage(winner)}</p>
                </div>

                <Button onClick={confirmResult} size="lg" className="w-full text-lg py-4 shadow-xl hover:scale-105 transition-transform">
                  {winner.type === ItemType.SKIP ? '跳過回合' : '確認並繼續'}
                </Button>
              </div>
           </div>
        </div>
       )}
    </div>
  );
};