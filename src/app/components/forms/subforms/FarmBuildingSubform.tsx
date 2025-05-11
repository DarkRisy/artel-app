import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FarmBuildingSubform({
  formData,
  onInputChange,
  onCheckboxChange
}: FormStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const buildingTypes = [
    { value: 'Коровник', icon: '', color: 'bg-yellow-500/20' },
    { value: 'Свинарник', icon: '', color: 'bg-pink-500/20' },
    { value: 'Птичник', icon: '', color: 'bg-red-500/20' },
    { value: 'Хранилище', icon: '', color: 'bg-blue-500/20' },
    { value: 'Мастерская', icon: '', color: 'bg-gray-500/20' },
    { value: 'Другое', icon: '', color: 'bg-purple-500/20' }
  ];

  const materials = [
    { value: 'Кирпич', icon: '' },
    { value: 'Металлоконструкции', icon: '' },
    { value: 'Дерево', icon: '' },
    { value: 'Железобетон', icon: '' },
    { value: 'Сэндвич-панели', icon: '' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=" rounded-xl overflow-hidden backdrop-blur-sm"
    >
      
        <h3 className="text-lg font-semibold text-white flex items-center">
          Сельскохозяйственные здания
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
            <label className="block text-sm font-medium text-white/90 mb-3">Тип здания</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {buildingTypes.map((building, index) => (
                <motion.label
                  key={building.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    formData.farmBuildingType.includes(building.value)
                      ? `${building.color} border-transparent shadow-md`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="farmBuildingType"
                    value={building.value}
                    checked={formData.farmBuildingType.includes(building.value)}
                    onChange={onCheckboxChange}
                    className="hidden"
                  />
                  <span className="text-xl mr-3">{building.icon}</span>
                  <span className="text-white/90">{building.value}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Площадь здания</label>
              <div className="relative">
                <input
                  type="number"
                  name="farmBuildingArea"
                  value={formData.farmBuildingArea}
                  onChange={onInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м²</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Высота здания</label>
              <div className="relative">
                <input
                  type="number"
                  name="farmBuildingHeight"
                  value={formData.farmBuildingHeight}
                  onChange={onInputChange}
                  step="0.1"
                  min="2"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">м</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Материал стен</label>
              <div className="relative">
                <select
                  name="farmBuildingMaterial"
                  value={formData.farmBuildingMaterial || ''}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="">Не выбрано</option>
                  {materials.map(material => (
                    <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" key={material.value} value={material.value}>
                      {material.icon} {material.value}
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