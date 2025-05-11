import { motion, useAnimation } from 'framer-motion';
import { FormStepProps } from '../types';

export default function ServiceStep({ 
  formData, 
  onInputChange, 
  nextStep 
}: FormStepProps & { nextStep: () => void }) {
  const controls = useAnimation();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-white">1. Выберите тип услуги</h2>
      
      <div className="mb-4">
        <label className="block text-white mb-2">Категория услуги*</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={onInputChange}
          required
          className="w-full p-2 border bg-[#2D3538] border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>-- Выберите категорию --</option>
          <optgroup label="Строительство сооружений">
            <option value="farm_building">Сельскохозяйственные здания</option>
            <option value="storage">Здания для хранения продукции</option>
            <option value="livestock">Животноводческие комплексы</option>
            <option value="greenhouse">Тепличные комплексы</option>
          </optgroup>
          <optgroup label="Работы">
            <option value="landscape">Благоустройство территории</option>
            <option value="earthwork">Земляные работы</option>
            <option value="foundation">Фундаментные работы</option>
            <option value="road">Дорожные работы</option>
            <option value="drainage">Дренажные системы</option>
          </optgroup>
          <option value="other">Другое (уточнить ниже)</option>
        </select>
      </div>

      {formData.serviceType === 'other' && (
        <div className="mb-4">
          <label className="block text-white mb-2">Укажите вашу услугу</label>
          <input
            type="text"
            name="otherService"
            value={formData.otherService}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Опишите необходимую услугу"
          />
        </div>
      )}

      <motion.button
          type="button"
          onClick={nextStep}
          animate={controls}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 15px rgba(195, 77, 63, 0.5)"
          }}
          className={`px-8 py-3 rounded-xl text-white font-medium relative overflow-hidden bg-gradient-to-r from-[#C34D3F] to-[#A23E32] hover:from-[#A23E32] hover:to-[#C34D3F] shadow-lg`}
        >     
            <motion.div 
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white/10"/>

          <span className="relative z-10 flex items-center">
            Далее
            <svg 
              className={`w-5 h-5 ml-2 transition-transform group-hover:translate-x-1`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </motion.button>
    </div>
  );
}
