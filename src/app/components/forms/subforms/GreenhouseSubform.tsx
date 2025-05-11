import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GreenhouseSubform({
  formData,
  onCheckboxChange,
  onInputChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const greenhouseTypes = [
    { value: 'Пленочная', icon: '', color: 'bg-blue-500/20' },
    { value: 'Стеклянная', icon: '', color: 'bg-green-500/20' },
    { value: 'Поликарбонатная', icon: '', color: 'bg-orange-500/20' }
  ];

  const heatingOptions = [
    { value: 'Без обогрева', icon: '' },
    { value: 'Водяной', icon: '' },
    { value: 'Электрический', icon: '' },
    { value: 'Газовый', icon: '' },
    { value: 'Солнечный', icon: '' }
  ];

  const irrigationOptions = [
    { value: 'Капельный', icon: '' },
    { value: 'Дождевание', icon: '' },
    { value: 'Внутрипочвенный', icon: '' }
  ];

  const features = [
    { value: 'Автоматизация', icon: '', color: 'bg-purple-500/20' },
    { value: 'Досвечивание', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Система CO₂', icon: '', color: 'bg-gray-500/20' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
     
        <h3 className="text-lg font-semibold text-white flex items-center">
          Тепличные комплексы
        </h3>
        

      {(
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-6"
        >
          {/* Тип теплицы */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Тип теплицы</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {greenhouseTypes.map((type, index) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <input
                    type="radio"
                    id={`type-${type.value}`}
                    name="greenhouseType"
                    value={type.value}
                    checked={formData.greenhouseType === type.value}
                    onChange={onInputChange}
                    className="hidden peer"
                  />
                  <label 
                    htmlFor={`type-${type.value}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.greenhouseType === type.value 
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

          {/* Площадь, Обогрев, Полив */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Площадь */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Площадь</label>
              <div className="relative">
                <input
                  type="number"
                  name="greenhouseArea"
                  value={formData.greenhouseArea}
                  onChange={onInputChange}
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">га</span>
              </div>
            </div>
            
            {/* Обогрев */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Тип обогрева</label>
              <div className="relative">
                <select
                  name="greenhouseHeating"
                  value={formData.greenhouseHeating}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  {heatingOptions.map(option => (
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
            
            {/* Полив */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Система полива</label>
              <div className="relative">
                <select
                  name="greenhouseIrrigation"
                  value={formData.greenhouseIrrigation || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option  className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="">Не выбрано</option>
                  {irrigationOptions.map(option => (
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

          {/* Особенности */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">Дополнительные системы</label>
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <motion.label
                  key={feature.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.greenhouseFeatures?.includes(feature.value)
                      ? `${feature.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="greenhouseFeatures"
                    value={feature.value}
                    checked={formData.greenhouseFeatures?.includes(feature.value)}
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