import React from 'react';
import { Player, ItemType } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { TYPE_COLORS, TYPE_LABELS } from '../constants';
import { RotateCcw } from 'lucide-react';

interface ResultsScreenProps {
  players: Player[];
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ players, onRestart }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          遊戲結束
        </h1>
        <p className="text-xl text-slate-400">最終結果總覽</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <Card key={player.id} className="p-0 flex flex-col bg-slate-800/80 border-slate-700">
            <div className="p-4 bg-slate-900 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white text-center">{player.name}</h3>
            </div>
            
            <div className="p-4 space-y-3 flex-1">
               {player.history.length === 0 ? (
                 <div className="text-slate-500 text-center text-sm py-4 italic">未獲得任何項目</div>
               ) : (
                 player.history.map((item, idx) => (
                   <div key={`${item.id}-${idx}`} className="flex items-start gap-3 text-sm">
                      <span className={`
                        mt-1 flex-shrink-0 w-2 h-2 rounded-full 
                        ${TYPE_COLORS[item.type].split(' ')[0].replace('bg-', 'bg-')}
                      `} />
                      <div>
                        <span className="block font-bold text-slate-300 text-xs uppercase opacity-75">
                          {TYPE_LABELS[item.type].split(' ')[1]}
                        </span>
                        <span className="text-slate-200">{item.content}</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-12 pb-8">
        <Button onClick={onRestart} size="lg" variant="secondary" className="gap-2">
          <RotateCcw className="w-5 h-5" /> 開始新遊戲
        </Button>
      </div>
    </div>
  );
};