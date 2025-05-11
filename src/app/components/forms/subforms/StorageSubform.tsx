import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function StorageSubform({
  formData,
  onInputChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const storageTypes = [
    { value: 'Зернохранилище', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Овощехранилище', icon: '', color: 'bg-orange-500/20' },
    { value: 'Фруктохранилище', icon: '', color: 'bg-red-500/20' },
    { value: 'Холодильное', icon: '', color: 'bg-blue-500/20' },
    { value: 'Универсальное', icon: '', color: 'bg-gray-500/20' }
  ];

  const ventilationOptions = [
    { value: 'Естественная', icon: '' },
    { value: 'Принудительная', icon: '' },
    { value: 'Климат-контроль', icon: '' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Здания для хранения продукции
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
            <label className="block text-sm font-medium text-white/90 mb-3">Тип хранилища</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {storageTypes.map((type, index) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <input
                    type="radio"
                    id={`type-${type.value}`}
                    name="storageType"
                    value={type.value}
                    checked={formData.storageType === type.value}
                    onChange={onInputChange}
                    className="hidden peer"
                  />
                  <label 
                    htmlFor={`type-${type.value}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.storageType === type.value 
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
              <label className="block text-sm font-medium text-white/90 mb-2">Вместимость</label>
              <div className="relative">
                <input
                  type="number"
                  name="storageCapacity"
                  value={formData.storageCapacity}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">тонн</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Температурный режим</label>
              <div className="relative">
                <input
                  type="number"
                  name="storageTemperature"
                  value={formData.storageTemperature}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="например, +4 или -18"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">°C</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Система вентиляции</label>
              <div className="relative">
                <select
                  name="storageVentilation"
                  value={formData.storageVentilation || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="">Не выбрано</option>
                  {ventilationOptions.map(option => (
                    <option  className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" key={option.value} value={option.value}>
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
        </motion.div>
      )}
    </motion.div>
  );
}