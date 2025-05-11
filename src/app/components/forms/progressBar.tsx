import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Услуга', icon: '🛠️' },
    { number: 2, label: 'Детали', icon: '📋' },
    { number: 3, label: 'Проект', icon: '🏗️' },
    { number: 4, label: 'Контакты', icon: '📞' }
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      width: `${(currentStep - 1) * 33.33}%`,
      transition: { duration: 0.8, ease: "easeInOut" }
    });
  }, [currentStep, controls]);

  return (
    <div className="relative w-full mb-12 px-4">
      {/* Фоновая линия */}
      <div className="absolute top-6 left-4 right-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full z-0">
        {/* Активная линия */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          initial={{ width: 0 }}
          animate={controls}
        />
      </div>

      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.number;
          const isCurrent = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <motion.div 
              key={step.number}
              className="flex flex-col items-center relative"
              initial={{ y: 0 }}
              whileHover={{ y: -5 }}
            >
              {/* Шаг */}
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center relative shadow-lg
                  ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-white dark:bg-gray-800'} 
                  ${isCurrent ? 'ring-4 ring-orange-300/50' : ''}`}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: isCurrent ? 1.1 : 1,
                  y: isCurrent ? [-5, 0, -5] : 0
                }}
                transition={{
                  scale: { duration: 0.3 },
                  y: isCurrent ? { 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  } : {}
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.span 
                    className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      scale: isCurrent ? { 
                        duration: 1.5, 
                        repeat: Infinity 
                      } : {}
                    }}
                  >
                    {isCurrent ? step.icon : step.number}
                  </motion.span>
                )}

                {/* Свечение для текущего шага */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-orange-400/20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
              
              {/* Подпись */}
              <motion.div
                className={`mt-3 px-3 py-1 rounded-full text-sm font-medium
                  ${isActive ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 
                    'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                animate={{ 
                  y: isCurrent ? [0, -3, 0] : 0
                }}
                transition={{
                  y: isCurrent ? { 
                    duration: 2, 
                    repeat: Infinity 
                  } : {}
                }}
              >
                {step.label}
              </motion.div>

              {/* Соединительная линия */}
              {index < steps.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-1 -z-10">
                  {isActive ? (
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                  ) : (
                    <div className="h-full bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}