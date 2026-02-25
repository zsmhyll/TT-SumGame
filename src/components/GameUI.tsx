import { motion } from 'motion/react';
import { Target, Trophy, Clock, Zap } from 'lucide-react';
import { GameMode } from '../types';

interface GameUIProps {
  target: number;
  currentSum: number;
  score: number;
  timeLeft: number;
  mode: GameMode;
  combo: number;
}

export const GameUI = ({ target, currentSum, score, timeLeft, mode, combo }: GameUIProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Target Card */}
      <motion.div 
        key={target}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border-b-4 border-rose-500"
      >
        <div className="flex items-center gap-2 text-rose-500 mb-1">
          <Target size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">目标值</span>
        </div>
        <div className="text-4xl font-black text-slate-800">{target}</div>
      </motion.div>

      {/* Current Sum Card */}
      <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border-b-4 border-blue-500">
        <div className="flex items-center gap-2 text-blue-500 mb-1">
          <Zap size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">当前和</span>
        </div>
        <div className={`text-4xl font-black transition-colors ${currentSum > target ? 'text-rose-500' : 'text-slate-800'}`}>
          {currentSum}
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border-b-4 border-amber-500">
        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <Trophy size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">得分</span>
        </div>
        <div className="text-2xl font-black text-slate-800">{score.toLocaleString()}</div>
        {combo > 1 && (
          <motion.div 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"
          >
            x{combo} 连击
          </motion.div>
        )}
      </div>

      {/* Timer Card (Only for Time Mode) */}
      {mode === 'time' && (
        <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border-b-4 border-emerald-500">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Clock size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">剩余时间</span>
          </div>
          <div className={`text-4xl font-black ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
            {timeLeft}秒
          </div>
        </div>
      )}
    </div>
  );
};
