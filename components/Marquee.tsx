import React, { useEffect, useState, useRef } from 'react';
import { LotteryItem } from '../types';
import { TYPE_COLORS, TYPE_LABELS } from '../constants';

interface MarqueeProps {
  items: LotteryItem[];
  isSpinning: boolean;
  winnerItem: LotteryItem | null;
  onSpinEnd: () => void;
}

export const Marquee: React.FC<MarqueeProps> = ({ items, isSpinning, winnerItem, onSpinEnd }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // State for the specific strip of items we will animate
  const [reelItems, setReelItems] = useState<LotteryItem[]>([]);
  
  // Animation state
  const [translateX, setTranslateX] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  
  // Constants strictly matching CSS
  const CARD_WIDTH = 220; 
  const GAP = 16;         // gap-4
  const PADDING_X = 16;   // px-4
  const ITEM_FULL_WIDTH = CARD_WIDTH + GAP;
  
  // The fixed index where we will place the winner
  // Index 30 means ~30 items pass by before stopping, giving a good spin duration.
  const WINNER_INDEX = 30; 
  
  // Fixed Duration (Seconds)
  const SPIN_DURATION = 5.0;

  // Helper to get a random item from the pool
  const getRandomItem = (pool: LotteryItem[]) => {
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // 1. Initialization (Idle State)
  useEffect(() => {
    if (items.length === 0) return;
    
    // If we are NOT spinning, just show a static look of the current items
    // repeated enough to fill the screen nicely.
    if (!isSpinning) {
      const MIN_DISPLAY = 10;
      let displayList: LotteryItem[] = [...items];
      while (displayList.length < MIN_DISPLAY) {
        displayList = displayList.concat(items);
      }
      setReelItems(displayList);
      setTranslateX(0);
      setTransitionDuration(0);
    }
  }, [items, isSpinning]);

  // 2. Spin Logic
  useEffect(() => {
    if (!isSpinning || !winnerItem || !viewportRef.current || items.length === 0) {
      return;
    }

    // A. Construct the "Winning Reel"
    // [ Random x 30 ] + [ WINNER ] + [ Random x 5 ]
    const newReel: LotteryItem[] = [];
    
    // Fill prefix
    for (let i = 0; i < WINNER_INDEX; i++) {
      const random = getRandomItem(items);
      if (random) newReel.push({ ...random, id: `rand-${i}-${Date.now()}` }); // Ensure unique keys
    }
    
    // Place Winner
    newReel.push({ ...winnerItem, id: `winner-${Date.now()}` });
    
    // Fill suffix
    for (let i = 0; i < 5; i++) {
      const random = getRandomItem(items);
      if (random) newReel.push({ ...random, id: `suffix-${i}-${Date.now()}` });
    }

    setReelItems(newReel);

    // B. Animation Sequence
    const startAnimation = () => {
      if (!viewportRef.current) return;

      // 1. Reset Position (Instant)
      // Start at 0px so we see the beginning of our new reel
      setTransitionDuration(0);
      setTranslateX(0);

      // 2. Calculate Target Position (The Math)
      // We want the CENTER of the card at WINNER_INDEX to be at the CENTER of the Viewport.
      
      const viewportWidth = viewportRef.current.offsetWidth;
      const viewportCenter = viewportWidth / 2;
      
      // Distance from the left edge of the content container to the center of the winner card
      // PADDING_X is the left padding of the container
      const winnerCenterPos = PADDING_X + (WINNER_INDEX * ITEM_FULL_WIDTH) + (CARD_WIDTH / 2);
      
      // The translateX needed to bring winnerCenterPos to viewportCenter
      // Formula: ViewportCenter - ItemCenter
      const targetTranslateX = viewportCenter - winnerCenterPos;

      // 3. Trigger Animation (Next Frame)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Set duration (seconds) - adjust for speed sensation
          // cubic-bezier(0.2, 0.8, 0.2, 1) gives a nice "fast start, slow stop" friction feel
          setTransitionDuration(SPIN_DURATION); 
          setTranslateX(targetTranslateX);
          
          // 4. End Callback
          setTimeout(() => {
             onSpinEnd();
          }, SPIN_DURATION * 1000); // Match duration exactly
        });
      });
    };

    startAnimation();

  }, [isSpinning, winnerItem, items, onSpinEnd]);

  return (
    <div 
      ref={viewportRef} 
      className="w-full overflow-hidden py-8 relative bg-slate-900/50 rounded-2xl border-y-4 border-slate-700 shadow-inner"
    >
      {/* Center Marker / Pointer */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-yellow-400/50 z-20 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-400 z-30 drop-shadow-lg text-2xl animate-bounce filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
         ▼
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-yellow-400 z-30 drop-shadow-lg text-2xl animate-bounce filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
         ▲
      </div>

      <div 
        className="flex px-4 gap-4 will-change-transform"
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          transition: transitionDuration > 0 
            ? `transform ${transitionDuration}s cubic-bezier(0.15, 0.85, 0.35, 1)` 
            : 'none',
        }}
      >
        {reelItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className={`
              flex-shrink-0 relative rounded-xl p-4 flex flex-col items-center justify-center text-center
              shadow-lg border border-white/10
              ${TYPE_COLORS[item.type]}
            `}
            style={{ width: `${CARD_WIDTH}px`, height: '140px' }}
          >
            <span className="text-xs font-black uppercase tracking-wider mb-2 bg-black/20 px-2 py-0.5 rounded shadow-sm">
              {TYPE_LABELS[item.type].split(' ')[1]}
            </span>
            <span className="font-bold text-lg leading-tight line-clamp-3 drop-shadow-md">
              {item.content}
            </span>
          </div>
        ))}
      </div>
      
      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
    </div>
  );
};