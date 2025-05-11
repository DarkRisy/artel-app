import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EarthworkSubform({
  formData,
  onInputChange,
  onCheckboxChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const workTypes = [
    { value: 'Разработка грунта', icon: '' },
    { value: 'Обратная засыпка', icon: '' },
    { value: 'Планировка', icon: '' },
    { value: 'Траншеи', icon: '' },
    { value: 'Котлованы', icon: '' },
    { value: 'Снос сооружений', icon: '' }
  ];

  const equipmentOptions = [
    { value: 'Экскаватор', icon: '' },
    { value: 'Бульдозер', icon: '' },
    { value: 'Погрузчик', icon: '' },
    { value: 'Грейдер', icon: '' },
    { value: 'Самосвал', icon: '' },
    { value: 'Заказчик предоставит', icon: '' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Земляные работы
        </h3>
        

      { (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Вид работ</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workTypes.map((work, index) => (
                <motion.label
                  key={work.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.earthworkType.includes(work.value)
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="earthworkType"
                    value={work.value}
                    checked={formData.earthworkType.includes(work.value)}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="mr-2">{work.icon}</span>
                  <span className="text-white/90">{work.value}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Объем работ</label>
              <div className="relative">
                <input
                  type="number"
                  name="earthworkVolume"
                  value={formData.earthworkVolume}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м³</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Глубина</label>
              <div className="relative">
                <input
                  type="number"
                  name="earthworkDepth"
                  value={formData.earthworkDepth}
                  onChange={onInputChange}
                  step="0.1"
                  min="0.1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Необходимая техника</label>
              <div className="relative">
                <select
                  name="earthworkEquipment"
                  value={formData.earthworkEquipment}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="" disabled>Выберите технику</option>
                  {equipmentOptions.map(option => (
                    <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" key={option.value} value={option.value}>
                      {option.icon} {option.value}
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

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Дополнительные требования</label>
            <div className="relative">
              <textarea
                name="earthworkComments"
                value={formData.earthworkComments || ''}
                onChange={onInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30"
                placeholder="Особые условия, требования к грунту и т.д."
              ></textarea>
              <div className="absolute right-3 top-3 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}