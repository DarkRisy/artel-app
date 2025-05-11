import { FormStepProps } from '../types';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ContactStep({
  formData,
  onInputChange,
  onCheckboxChange,
  onPhoneInput,
  prevStep,
  isLoadingUser
}: FormStepProps & { prevStep: () => void; isLoadingUser: boolean }) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsAgreed(formData.agree);
  }, [formData.agree]);

  const contactMethods = [
    { value: 'Телефон', label: 'Телефон', icon: '', color: 'bg-blue-100/20' },
    { value: 'email', label: 'Email', icon: '', color: 'bg-purple-100/20' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '', color: 'bg-green-100/20' },
    { value: 'telegram', label: 'Telegram', icon: '', color: 'bg-cyan-100/20' }
  ];

  const callTimes = [
    { value: 'В любое время', label: 'В любое время', icon: '' },
    { value: 'Утро (8-12)', label: 'Утро (8-12)', icon: '' },
    { value: 'День (12-16)', label: 'День (12-16)', icon: '' },
    { value: 'Вечер (16-18)', label: 'Вечер (16-18)', icon: '' }
  ];

  if (isLoadingUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-white/80"
        >
          Загрузка данных...
        </motion.p>
      </motion.div>
    );
  }

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
          Контактные данные
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-white/70"
        >
          Укажите как с вами связаться для уточнения деталей
        </motion.p>
      </div>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-2">
            Как к вам обращаться<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30 transition-all backdrop-blur-sm"
              placeholder="Иван Иванов"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
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
            <label className="block text-sm font-medium text-white/90 mb-2">
              Контактный телефон<span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={onPhoneInput}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30 transition-all backdrop-blur-sm"
                placeholder="+7 (___) ___-__-__"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">Электронная почта</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30 transition-all backdrop-blur-sm"
                placeholder="example@mail.com"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
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
          <label className="block text-sm font-medium text-white/90 mb-3">Предпочтительный способ связи</label>
          <div className="flex flex-wrap gap-3">
            {contactMethods.map((option, index) => (
              <motion.label 
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`flex items-center px-4 py-2 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  formData.contactMethod.includes(option.value) 
                    ? `${option.color} border-transparent shadow-md` 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  name="contactMethod"
                  value={option.value}
                  checked={formData.contactMethod.includes(option.value)}
                  onChange={onCheckboxChange}
                  className="hidden"
                />
                <span className="mr-2 text-lg">{option.icon}</span>
                <span className="text-white/90">{option.label}</span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="block text-sm font-medium text-white/90 mb-2">Удобное время для звонка</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {callTimes.map((time, index) => (
              <motion.div
                key={time.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <input
                  type="radio"
                  id={`callTime-${time.value}`}
                  name="callTime"
                  value={time.label}
                  checked={formData.callTime === time.label}
                  onChange={onInputChange}
                  className="hidden peer"
                />
                <label 
                  htmlFor={`callTime-${time.value}`}
                  className={`block p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-400/30 ${
                    formData.callTime === time.label 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{time.icon}</span>
                    <span className="text-white/90">{time.label}</span>
                  </div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="pt-2"
        >
          <label className="flex items-start group cursor-pointer">
            <div className="flex items-center h-5 mt-0.5">
              <div className={`relative w-5 h-5 rounded border flex items-center justify-center transition-all ${
                isAgreed ? 'bg-blue-500 border-blue-500' : 'bg-white/5 border-white/20 group-hover:border-blue-400'
              }`}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={isAgreed}
                  onChange={(e) => {
                    onCheckboxChange(e);
                    setIsAgreed(e.target.checked);
                  }}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                {isAgreed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-sm text-white/80 group-hover:text-white/90 transition-colors">
              Я согласен на обработку персональных данных и согласен с{' '}
              <a href="/privacy" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
                политикой конфиденциальности
              </a>
            </span>
          </label>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-between pt-8"
      >
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all flex items-center group"
        >
          <motion.span 
            whileHover={{ x: -2 }}
            className="flex items-center"
          >
            <svg className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Назад
          </motion.span>
        </button>
        <button
          type="submit"
          disabled={!isAgreed}
          onMouseEnter={() => setIsSubmitted(true)}
          onMouseLeave={() => setIsSubmitted(false)}
          className={`px-8 py-3 rounded-xl text-white font-medium transition-all flex items-center group relative overflow-hidden ${
            !isAgreed 
              ? 'bg-gray-600 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20'
          }`}
        >
          <motion.span 
            animate={{ x: isSubmitted ? -5 : 0 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="flex items-center z-10"
          >
            Отправить заявку
            <svg 
              className={`w-5 h-5 ml-2 transition-transform ${isSubmitted ? 'translate-x-1' : 'translate-x-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.span>
          {isAgreed && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isSubmitted ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white/10 z-0"
            />
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}