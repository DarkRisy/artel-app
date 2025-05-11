import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import FormNavigation from '../formNavigation';
import { useState } from 'react';

export default function ProjectStep({
  formData,
  onInputChange,
  onCheckboxChange,
  onFileChange,
  prevStep,
  nextStep
}: FormStepProps & { prevStep: () => void; nextStep: () => void }) {
  const isNextDisabled = !formData.location.trim();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFileChange({ target: { files: e.dataTransfer.files } } as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="pb-4 border-b border-white/10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white"
        >
          Информация о проекте
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-white/70"
        >
          Укажите детали вашего проекта
        </motion.p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-2">
            Местоположение объекта<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30 transition-all backdrop-blur-sm"
              placeholder="Населенный пункт, район"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">Желаемые сроки выполнения</label>
            <div className="relative">
              <select
                name="timing"
                value={formData.timing}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
              >
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Срочно">Срочно</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="В течение 1-3 месяцев">В течение 1-3 месяцев</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="В течение 3-6 месяцев">В течение 3-6 месяцев</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="В течение 6-12 месяцев">В течение 6-12 месяцев</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Сроки гибкие">Сроки гибкие</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">Бюджет проекта</label>
            <div className="relative">
              <select
                name="budget"
                value={formData.budget}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10"
              >
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Не определен">-- Не определен --</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="До 500 тыс. руб.">До 500 тыс. руб.</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="500 тыс. - 1 млн руб.">500 тыс. - 1 млн руб.</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="1-3 млн руб.">1-3 млн руб.</option>
                <option className="bg-[#2D3538] text-white hover:bg-[#C34D3F]" value="Более 3 млн руб.">Более 3 млн руб.</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-3">Есть ли у вас проектная документация?</label>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'да', label: 'Да', icon: '' },
              { value: 'нет', label: 'Нет', icon: '' },
              { value: 'Частично', label: 'Частично', icon: '' }
            ].map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <input
                  type="radio"
                  id={`hasDocs-${option.value}`}
                  name="hasDocs"
                  value={option.value}
                  checked={formData.hasDocs === option.value}
                  onChange={onInputChange}
                  className="hidden peer"
                />
                <label 
                  htmlFor={`hasDocs-${option.value}`}
                  className={`flex items-center px-4 py-2 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                    formData.hasDocs === option.value 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  <span className="text-white/90">{option.label}</span>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-2">Дополнительные пожелания</label>
          <div className="relative">
            <textarea
              name="comments"
              value={formData.comments}
              onChange={onInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30 transition-all backdrop-blur-sm"
              placeholder="Опишите ваши особые требования, пожелания..."
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-2">Прикрепить файлы (проекты, фото, схемы)</label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-white/80">
                {isDragging ? 'Отпустите файлы для загрузки' : 'Перетащите файлы сюда или'}
              </p>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Выберите файлы
                </span>
                <input
                  type="file"
                  name="attachments"
                  onChange={onFileChange}
                  multiple
                  accept=".pdf,.jpg,.png,.dwg"
                  className="hidden"
                />
              </label>
              <p className="text-xs text-white/50 mt-2">
                Максимальный размер файла 10MB. Форматы: PDF, JPG, PNG, DWG
              </p>
              
            </div>
          </div>
        </motion.div>
      </div>

      <FormNavigation 
        onPrev={prevStep} 
        onNext={nextStep} 
        isNextDisabled={isNextDisabled} 
      />
    </motion.div>
  );
}