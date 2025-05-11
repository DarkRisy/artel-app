import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LivestockSubform({
  formData,
  onInputChange,
  onCheckboxChange,
  setFormData
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const livestockTypes = [
    { value: 'Молочная ферма', icon: '', color: 'bg-blue-500/20' },
    { value: 'Мясное скотоводство', icon: '', color: 'bg-red-500/20' },
    { value: 'Птицефабрика', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Свинокомплекс', icon: '', color: 'bg-pink-500/20' },
    { value: 'Овцеводство', icon: '', color: 'bg-gray-500/20' },
    { value: 'Козоводство', icon: '', color: 'bg-brown-500/20' }
  ];

  const features = [
    { 
      value: 'Автопоение/кормление', 
      label: 'Автопоение/кормление',
      icon: '',
      color: 'bg-green-500/20'
    },
    { 
      value: 'Система удаления навоза', 
      label: 'Система удаления навоза',
      icon: '',
      color: 'bg-amber-500/20'
    },
    { 
      value: 'Доильный зал', 
      label: 'Доильный зал',
      icon: '',
      color: 'bg-blue-500/20'
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
          
          Животноводческие комплексы
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
            <label className="block text-sm font-medium text-white/90 mb-3">Тип комплекса</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {livestockTypes.map((type, index) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <input
                    type="radio"
                    id={`type-${type.value}`}
                    name="livestockType"
                    value={type.value}
                    checked={formData.livestockType === type.value}
                    onChange={onInputChange}
                    className="hidden peer"
                  />
                  <label 
                    htmlFor={`type-${type.value}`}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.livestockType === type.value 
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
              <label className="block text-sm font-medium text-white/90 mb-2">Количество животных</label>
              <div className="relative">
                <input
                  type="number"
                  name="livestockAnimalsCount"
                  value={formData.livestockAnimalsCount}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Площадь комплекса</label>
              <div className="relative">
                <input
                  type="number"
                  name="livestockArea"
                  value={formData.livestockArea}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м²</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center p-3 rounded-lg border cursor-pointer bg-white/5 border-white/10 hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  name="livestockVentilation"
                  checked={formData.livestockVentilation}
                  onChange={(e) => setFormData(prev => ({...prev, livestockVentilation: e.target.checked}))}
                  className="hidden peer"
                />
                <span className={`w-5 h-5 rounded border flex items-center justify-center mr-2 transition-all ${
                  formData.livestockVentilation ? 'bg-blue-500 border-blue-500' : 'bg-white/5 border-white/20'
                }`}>
                  {formData.livestockVentilation && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </span>
                <span className="text-white/90">Принудительная вентиляция</span>
              </label>
            </div>
          </div>

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
                    formData.livestockFeatures?.includes(feature.value)
                      ? `${feature.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="livestockFeatures"
                    value={feature.value}
                    checked={formData.livestockFeatures?.includes(feature.value)}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="text-lg mr-2">{feature.icon}</span>
                  <span className="text-white/90">{feature.label}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}