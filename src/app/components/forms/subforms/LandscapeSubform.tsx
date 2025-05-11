import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandscapeSubform({
  formData,
  onInputChange,
  onCheckboxChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const landscapeWorks = [
    { value: 'Устройство газона', icon: '', color: 'bg-green-500/20' },
    { value: 'Мощение плиткой', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Освещение территории', icon: '', color: 'bg-blue-500/20' },
    { value: 'Озеленение', icon: '', color: 'bg-emerald-500/20' },
    { value: 'Ограждение территории', icon: '', color: 'bg-gray-500/20' }
  ];

  const pavingTypes = [
    { value: 'Тротуарная плитка', icon: '' },
    { value: 'Асфальт', icon: '' },
    { value: 'Натуральный камень', icon: '' },
    { value: 'Бетон', icon: '' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Благоустройство территории
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
            <label className="block text-sm font-medium text-white/90 mb-3">Виды работ</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {landscapeWorks.map((work, index) => (
                <motion.label
                  key={work.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    formData.landscapeWorks.includes(work.value)
                      ? `${work.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="landscapeWorks"
                    value={work.value}
                    checked={formData.landscapeWorks.includes(work.value)}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="text-xl mr-3">{work.icon}</span>
                  <span className="text-white/90">{work.value}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Площадь территории</label>
              <div className="relative">
                <input
                  type="number"
                  name="landscapeArea"
                  value={formData.landscapeArea}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">соток</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Тип покрытия для мощения</label>
              <div className="relative">
                <select
                  name="landscapePavingType"
                  value={formData.landscapePavingType || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="">Не выбрано</option>
                  {pavingTypes.map(type => (
                    <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" key={type.value} value={type.value}>
                      {type.icon} {type.value}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}