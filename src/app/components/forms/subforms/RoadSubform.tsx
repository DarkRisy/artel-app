import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function RoadSubform({
  formData,
  onCheckboxChange,
  onInputChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const roadTypes = [
    { value: 'Автодорога', icon: '', color: 'bg-blue-500/20' },
    { value: 'Полевая дорога', icon: '', color: 'bg-green-500/20' },
    { value: 'Подъездной путь', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Парковка', icon: '', color: 'bg-gray-500/20' },
    { value: 'Технологическая дорога', icon: '', color: 'bg-orange-500/20' }
  ];

  const coatings = [
    { value: 'Асфальт', icon: '' },
    { value: 'Бетон', icon: '' },
    { value: 'Гравий', icon: '' },
    { value: 'Грунт', icon: '' },
    { value: 'Брусчатка', icon: '' }
  ];

  const features = [
    { value: 'Дренажная система', icon: '', color: 'bg-blue-500/20' },
    { value: 'Освещение', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Разметка', icon: '', color: 'bg-white/20' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Дорожные работы
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
            <label className="block text-sm font-medium text-white/90 mb-3">Тип дороги</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roadTypes.map((type, index) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <input
                    type="radio"
                    id={`type-${type.value}`}
                    name="roadType"
                    value={type.value}
                    checked={formData.roadType === type.value}
                    onChange={onInputChange}
                    className="hidden peer"
                    required
                  />
                  <label 
                    htmlFor={`type-${type.value}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.roadType === type.value 
                        ? `${type.color} border-transparent shadow-md` 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl mr-2">{type.icon}</span>
                    <span className="text-white/90">{type.value}</span>
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Протяженность</label>
              <div className="relative">
                <input
                  type="number"
                  name="roadLength"
                  value={formData.roadLength || ''}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Ширина</label>
              <div className="relative">
                <input
                  type="number"
                  name="roadWidth"
                  value={formData.roadWidth || ''}
                  onChange={onInputChange}
                  step="0.1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Тип покрытия</label>
              <div className="relative">
                <select
                  name="roadCoating"
                  value={formData.roadCoating || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                  required
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="" disabled>Выберите покрытие</option>
                  {coatings.map(coating => (
                    <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" key={coating.value} value={coating.value}>
                      {coating.icon} {coating.value}
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
            <label className="block text-sm font-medium text-white/90 mb-3">Дополнительные элементы</label>
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <motion.label
                  key={feature.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.roadFeatures?.includes(feature.value)
                      ? `${feature.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="roadFeatures"
                    value={feature.value}
                    checked={formData.roadFeatures?.includes(feature.value) || false}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="text-lg mr-2">{feature.icon}</span>
                  <span className="text-white/90">{feature.value}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}