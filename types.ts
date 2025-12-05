export enum ItemType {
  PRIZE = 'PRIZE',     // P: Gift, removed after draw
  PENALTY = 'PENALTY', // D: Punishment, kept in list
  CHANCE = 'CHANCE',   // C: Special, removed
  SKIP = 'SKIP',       // S: Next player, removed
  BOSS = 'BOSS'        // M: Big penalty, removed
}

export interface LotteryItem {
  id: string;
  type: ItemType;
  content: string;
}

export interface Player {
  id: string;
  name: string;
  history: LotteryItem[];
}

export enum GamePhase {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS'
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  originalItems: LotteryItem[];
  currentItems: LotteryItem[];
  currentTurnIndex: number;
  winnerItem: LotteryItem | null;
}
