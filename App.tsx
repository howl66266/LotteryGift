import React, { useState } from 'react';
import { GamePhase, LotteryItem, Player } from './types';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [items, setItems] = useState<LotteryItem[]>([]);
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);

  const handleStartGame = (configuredPlayers: Player[], configuredItems: LotteryItem[], allowRepeatsSetting: boolean) => {
    setPlayers(configuredPlayers);
    setItems(configuredItems);
    setAllowRepeats(allowRepeatsSetting);
    setPhase(GamePhase.PLAYING);
  };

  const handleFinishGame = (finalPlayers: Player[]) => {
    setPlayers(finalPlayers);
    setPhase(GamePhase.RESULTS);
  };

  const handleRestart = () => {
    setPhase(GamePhase.SETUP);
    setPlayers([]);
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-pink-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {phase === GamePhase.SETUP && (
          <SetupScreen onStartGame={handleStartGame} />
        )}
        
        {phase === GamePhase.PLAYING && (
          <GameScreen 
            players={players} 
            items={items} 
            allowRepeats={allowRepeats}
            onFinishGame={handleFinishGame} 
          />
        )}
        
        {phase === GamePhase.RESULTS && (
          <ResultsScreen 
            players={players} 
            onRestart={handleRestart} 
          />
        )}
      </div>
    </div>
  );
}

export default App;