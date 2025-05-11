import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FoundationSubform({
  formData,
  onInputChange,
  onCheckboxChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const foundationTypes = [
    { 
      value: 'Ленточный фундамент', 
      icon: '⎿',
      description: 'По периметру стен',
      color: 'bg-blue-500/20'
    },
    { 
      value: 'Плитный фундамент', 
      icon: '▦',
      description: 'Сплошная плита',
      color: 'bg-green-500/20'
    },
    { 
      value: 'Свайный фундамент', 
      icon: '⏍',
      description: 'Отдельные опоры',
      color: 'bg-orange-500/20'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Фундаментные работы
        </h3>
        

      {(
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Тип фундамента</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {foundationTypes.map((type, index) => (
                <motion.label
                  key={type.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.foundationType.includes(type.value)
                      ? `${type.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="foundationType"
                      value={type.value}
                      checked={formData.foundationType.includes(type.value)}
                      onChange={onCheckboxChange}
                      className="hidden"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className="text-white/90 font-medium">{type.value}</span>
                  </div>
                  <span className="text-xs text-white/60">{type.description}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Площадь фундамента</label>
              <div className="relative">
                <input
                  type="number"
                  name="foundationArea"
                  value={formData.foundationArea}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м²</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Глубина заложения</label>
              <div className="relative">
                <input
                  type="number"
                  name="foundationDepth"
                  value={formData.foundationDepth}
                  onChange={onInputChange}
                  step="0.1"
                  min="0.5"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}