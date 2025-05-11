import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function FormNavigation({ 
  onPrev, 
  onNext,
  isNextDisabled = false
}: { 
  onPrev: () => void; 
  onNext?: () => void;
  isNextDisabled?: boolean 
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (isNextDisabled) {
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [isNextDisabled, controls]);

  return (
    <div className="flex justify-between gap-4 mt-8">
      <motion.button
        type="button"
        onClick={onPrev}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all flex items-center group relative overflow-hidden"
      >
        <motion.div
          whileHover={{ scaleX: 1 }}
          initial={{ scaleX: 0 }}
          className="absolute inset-0 bg-white/5 origin-left"
        />
        <svg className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Назад
      </motion.button>
      
      {onNext && (
        <motion.button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          animate={controls}
          whileHover={!isNextDisabled ? { 
            scale: 1.05,
            boxShadow: "0 0 15px rgba(195, 77, 63, 0.5)"
          } : {}}
          whileTap={!isNextDisabled ? { scale: 0.95 } : {}}
          className={`px-8 py-3 rounded-xl text-white font-medium relative overflow-hidden ${
            isNextDisabled 
              ? 'bg-gray-600 cursor-not-allowed opacity-80' 
              : 'bg-gradient-to-r from-[#C34D3F] to-[#A23E32] hover:from-[#A23E32] hover:to-[#C34D3F] shadow-lg'
          }`}
        >
          {!isNextDisabled && (
            <motion.div 
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white/10"
            />
          )}
          <span className="relative z-10 flex items-center">
            Далее
            <svg 
              className={`w-5 h-5 ml-2 transition-transform ${
                !isNextDisabled ? 'group-hover:translate-x-1' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </motion.button>
      )}
    </div>
  );
}