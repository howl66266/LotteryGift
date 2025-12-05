import React, { useState } from 'react';
import { Plus, Trash2, Play, RefreshCw, Users, Gift, Settings } from 'lucide-react';
import { ItemType, LotteryItem, Player } from '../types';
import { INITIAL_ITEMS, TYPE_LABELS, TYPE_COLORS } from '../constants';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface SetupScreenProps {
  onStartGame: (players: Player[], items: LotteryItem[], allowRepeats: boolean) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [items, setItems] = useState<LotteryItem[]>(INITIAL_ITEMS);
  const [players, setPlayers] = useState<string[]>(['玩家 1', '玩家 2']);
  const [allowRepeats, setAllowRepeats] = useState(false);
  
  // New Item State
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemType, setNewItemType] = useState<ItemType>(ItemType.PRIZE);
  
  // New Player State
  const [newPlayerName, setNewPlayerName] = useState('');

  const addItem = () => {
    if (!newItemContent.trim()) return;
    const newItem: LotteryItem = {
      id: Date.now().toString(),
      type: newItemType,
      content: newItemContent.trim()
    };
    setItems([...items, newItem]);
    setNewItemContent('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([...players, newPlayerName.trim()]);
    setNewPlayerName('');
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    if (players.length === 0 || items.length === 0) {
      alert("請至少新增一位玩家和一個抽獎項目。");
      return;
    }
    const playerObjects: Player[] = players.map((name, idx) => ({
      id: `p-${idx}`,
      name,
      history: []
    }));
    onStartGame(playerObjects, items, allowRepeats);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
          遊戲設置
        </h1>
        <p className="text-slate-400">設定您的抽獎項目與參與者</p>
      </div>

      {/* Game Rules Config */}
      <Card className="p-4 bg-slate-900/50 border-blue-500/30">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                <div>
                    <h3 className="font-bold text-slate-200">允許重複中獎</h3>
                    <p className="text-sm text-slate-400">若關閉，玩家獲得「獎品」後將不再參與後續抽獎。</p>
                </div>
            </div>
            <button 
                onClick={() => setAllowRepeats(!allowRepeats)}
                className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${allowRepeats ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${allowRepeats ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Players Section */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-200 border-b border-slate-700 pb-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h2>玩家列表 ({players.length})</h2>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="輸入玩家名稱"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Button onClick={addPlayer} size="sm"><Plus className="w-5 h-5" /></Button>
          </div>

          <div className="h-64 overflow-y-auto space-y-2 pr-2">
            {players.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <span className="font-medium text-slate-300">{p}</span>
                <button onClick={() => removePlayer(idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {players.length === 0 && <p className="text-center text-slate-600 py-8">尚未新增玩家</p>}
          </div>
        </Card>

        {/* Items Section */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-200 border-b border-slate-700 pb-2">
            <Gift className="w-6 h-6 text-pink-400" />
            <h2>跑馬燈項目 ({items.length})</h2>
          </div>

          <div className="space-y-3">
             <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.values(ItemType).map((type) => (
                   <button
                    key={type}
                    onClick={() => setNewItemType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      newItemType === type 
                        ? TYPE_COLORS[type] + ' border-transparent' 
                        : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'
                    }`}
                   >
                     {TYPE_LABELS[type]}
                   </button>
                ))}
             </div>
             <div className="flex gap-2">
              <input
                type="text"
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder={`輸入 ${TYPE_LABELS[newItemType]} 內容`}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <Button onClick={addItem} size="sm"><Plus className="w-5 h-5" /></Button>
            </div>
          </div>

          <div className="h-56 overflow-y-auto space-y-2 pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${TYPE_COLORS[item.type].split(' ')[0]}`}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase">{item.type}</span>
                    <span className="font-medium text-slate-300">{item.content}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
             {items.length === 0 && <p className="text-center text-slate-600 py-8">尚未新增項目</p>}
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button size="xl" onClick={handleStart} className="w-full md:w-auto shadow-2xl shadow-pink-900/40">
           <Play className="w-6 h-6" /> 開始抽獎
        </Button>
      </div>
    </div>
  );
};