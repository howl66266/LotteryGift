import { ItemType, LotteryItem } from './types';

export const INITIAL_ITEMS: LotteryItem[] = [
  { id: '1', type: ItemType.PRIZE, content: '$500 禮券' },
  { id: '2', type: ItemType.PRIZE, content: '高級巧克力' },
  { id: '3', type: ItemType.PENALTY, content: '現場唱一首歌' },
  { id: '4', type: ItemType.PENALTY, content: '做 10 個伏地挺身' },
  { id: '5', type: ItemType.CHANCE, content: '指定一人交換禮物' },
  { id: '6', type: ItemType.SKIP, content: '跳過一次' },
  { id: '7', type: ItemType.BOSS, content: '請大家喝飲料' },
];

export const TYPE_COLORS = {
  [ItemType.PRIZE]: 'bg-emerald-500 text-white shadow-emerald-500/50',
  [ItemType.PENALTY]: 'bg-rose-500 text-white shadow-rose-500/50',
  [ItemType.CHANCE]: 'bg-amber-500 text-white shadow-amber-500/50',
  [ItemType.SKIP]: 'bg-sky-500 text-white shadow-sky-500/50',
  [ItemType.BOSS]: 'bg-violet-600 text-white shadow-violet-600/50',
};

export const TYPE_LABELS = {
  [ItemType.PRIZE]: '🎁 獎品',
  [ItemType.PENALTY]: '😈 懲罰',
  [ItemType.CHANCE]: '🌟 機會',
  [ItemType.SKIP]: '⏭️ 跳過',
  [ItemType.BOSS]: '👹 大魔王',
};