import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Trophy, Info, Settings } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { Grid } from './components/Grid';
import { GameUI } from './components/GameUI';
import { GameMode } from './types';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState<GameMode>('classic');
  const { state, selectBlock, resetGame } = useGameLogic(mode);

  const currentSum = state.selectedIndices.reduce(
    (sum, idx) => sum + (state.grid[idx.row][idx.col]?.value || 0),
    0
  );

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setGameStarted(true);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-100">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <span className="text-white font-black text-xl">Σ</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">数字爆破</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Info size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            {!gameStarted ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center"
              >
                <h2 className="text-3xl font-black mb-4 text-slate-800">选择游戏模式</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  组合数字以达到目标总和。不要让方块堆积到顶部！
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => startGame('classic')}
                    className="group relative overflow-hidden bg-slate-900 text-white rounded-2xl p-6 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <Play className="mb-3 text-rose-500" fill="currentColor" size={32} />
                      <span className="text-xl font-bold mb-1">经典模式</span>
                      <span className="text-xs text-slate-400">每次成功后新增一行</span>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => startGame('time')}
                    className="group relative overflow-hidden bg-white border-2 border-slate-200 text-slate-800 rounded-2xl p-6 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-slate-900 shadow-lg"
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-3 text-blue-500">
                        <RotateCcw size={32} />
                      </div>
                      <span className="text-xl font-bold mb-1">计时模式</span>
                      <span className="text-xs text-slate-400">在倒计时中生存</span>
                    </div>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Info size={18} className="text-rose-500" />
                    玩法说明
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span className="font-bold text-rose-500">1.</span>
                      选择数字，使它们的总和等于 <strong>目标值</strong>。
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-rose-500">2.</span>
                      数字不需要相邻，可以选择任意位置。
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-rose-500">3.</span>
                      消除方块以防止堆栈到达顶部！
                    </li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <GameUI
                  target={state.target}
                  currentSum={currentSum}
                  score={state.score}
                  timeLeft={state.timeLeft}
                  mode={mode}
                  combo={state.combo}
                />

                <Grid
                  grid={state.grid}
                  selectedIndices={state.selectedIndices}
                  onBlockClick={selectBlock}
                />

                {/* Game Over Overlay */}
                <AnimatePresence>
                  {state.gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
                      >
                        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Trophy size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">游戏结束!</h2>
                        <p className="text-slate-500 mb-6">方块已经到达顶部。</p>
                        
                        <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">最终得分</div>
                          <div className="text-4xl font-black text-slate-800">{state.score.toLocaleString()}</div>
                        </div>

                        <button
                          onClick={() => setGameStarted(false)}
                          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={20} />
                          再玩一次
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Controls */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setGameStarted(false)}
                    className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    退出游戏
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-xs font-medium">
          <p>© 2024 数字爆破 • 基于 REACT 构建</p>
        </footer>
      </div>
    </div>
  );
}
