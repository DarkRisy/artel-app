import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DrainageSubform({
  formData,
  onCheckboxChange,
  onInputChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const drainageElements = [
    { value: 'Смотровые колодцы', icon: '' },
    { value: 'Коллекторы', icon: '' },
    { value: 'Фильтры', icon: '' },
    { value: 'Насосы', icon: '' },
    { value: 'Ревизионные камеры', icon: '' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
        <h3 className="text-lg font-semibold text-white flex items-center">
          Дренажные системы
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
            <label className="block text-sm font-medium text-white/90 mb-2">Тип дренажа</label>
            <div className="relative">
              <select
                name="drainageType"
                value={formData.drainageType}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
              >
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="" disabled>Выберите тип</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Поверхностный">Поверхностный</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Глубинный">Глубинный</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Вертикальный">Вертикальный</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Пластовый">Пластовый</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Пристенный">Пристенный</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Протяженность (м)</label>
              <div className="relative">
                <input
                  type="number"
                  name="drainageLength"
                  value={formData.drainageLength}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Глубина залегания (м)</label>
              <div className="relative">
                <input
                  type="number"
                  name="drainageDepth"
                  value={formData.drainageDepth}
                  onChange={onInputChange}
                  step="0.1"
                  min="0.3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Материал дрен</label>
              <div className="relative">
                <select
                  name="drainageMaterial"
                  value={formData.drainageMaterial || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="">Не выбрано</option>
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="ПВХ">ПВХ</option>
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Полиэтилен">Полиэтилен</option>
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Керамика">Керамика</option>
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Бетон">Бетон</option>
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Гравий">Гравий</option>
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
            <label className="block text-sm font-medium text-white/90 mb-3">Дополнительные элементы</label>
            <div className="flex flex-wrap gap-3">
              {drainageElements.map((element, index) => (
                <motion.label
                  key={element.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.drainageElements?.includes(element.value)
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="drainageElements"
                    value={element.value}
                    checked={formData.drainageElements?.includes(element.value)}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="mr-2">{element.icon}</span>
                  <span className="text-white/90">{element.value}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}