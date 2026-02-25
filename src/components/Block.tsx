import { motion, AnimatePresence } from 'motion/react';
import { BlockData } from '../types';

interface BlockProps {
  block: BlockData | null;
  isSelected: boolean;
  onClick: () => void;
}

export const Block = ({ block, isSelected, onClick }: BlockProps) => {
  return (
    <div className="relative w-full aspect-square p-0.5">
      <AnimatePresence mode="popLayout">
        {block ? (
          <motion.button
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0,
              boxShadow: isSelected ? '0 0 15px rgba(255,255,255,0.5)' : 'none'
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
              w-full h-full rounded-lg flex items-center justify-center
              text-white font-bold text-lg md:text-xl shadow-md
              transition-colors duration-200
              ${block.color}
              ${isSelected ? 'ring-4 ring-white z-10' : 'ring-0'}
            `}
          >
            {block.value}
          </motion.button>
        ) : (
          <div className="w-full h-full rounded-lg bg-black/5 border border-dashed border-black/10" />
        )}
      </AnimatePresence>
    </div>
  );
};
