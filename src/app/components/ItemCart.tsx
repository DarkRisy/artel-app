// 'use client'
// import React, { useEffect, useState, createContext, useContext } from 'react';
// import { motion } from 'framer-motion';

// // Создаем контекст для глобальных сообщений
// const MessageContext = createContext({ success: '', error: '' });

// const SquareComponent: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [inputValues, setInputValues] = useState(['', '']);
//   const [additionalValues, setAdditionalValues] = useState(['']);
//   const [messages, setMessages] = useContext(MessageContext); // Используем контекст

//   useEffect(() => {
//     const storedData = localStorage.getItem('cartData');
//     if (storedData) {
//       const { inputValues, additionalValues } = JSON.parse(storedData);
//       setInputValues(inputValues || ['', '']);
//       setAdditionalValues(additionalValues || ['']);
//     }
//   }, []);

//   const validateForm = () => {
//     const errors: string[] = [];
    
//     if (inputValues.some(value => !value.trim())) {
//       errors.push('Пожалуйста, заполните все поля');
//     }
    
//     if (!validateEmail(inputValues[0])) {
//       errors.push('Пожалуйста, введите действительный адрес электронной почты в поле 1');
//     }

//     const allValues = [...inputValues, ...additionalValues];
//     const areValuesUnique = new Set(allValues).size === allValues.length;
//     if (!areValuesUnique) {
//       errors.push('Все значения должны быть уникальными');
//     }

//     return errors.length > 0 ? errors : null;
//   };

//   const handleInputChange = (index: number, value: string, isAdditional: boolean = false) => {
//     if (isAdditional) {
//       const newValues = [...additionalValues];
//       newValues[index] = value;
//       setAdditionalValues(newValues);
//     } else {
//       const newValues = [...inputValues];
//       newValues[index] = value;
//       setInputValues(newValues);
//     }

//     setMessages({ success: '', error: '' }); // Сбрасываем сообщения
//   };

//   const handleAddToCart = async () => {
//     const errors = validateForm();
//     if (errors) {
//       setMessages({ error: errors.join(', '), success: '' });
//       return;
//     }

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const cartData = { inputValues, additionalValues };
//     localStorage.setItem('cartData', JSON.stringify(cartData));

//     setMessages({ success: 'Данные успешно добавлены в корзину!', error: '' });
//     setInputValues(['', '']);
//     setAdditionalValues(['']);
//   };

//   const handleClearFields = () => {
//     setInputValues(['', '']);
//     setAdditionalValues(['']);
//     setMessages({ success: '', error: '' });
//   };

//   const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleAddAdditionalField = () => {
//     setAdditionalValues([...additionalValues, '']);
//   };

//   return (
//     <div className="flex flex-col md:flex-row items-center">
//       <motion.div
//         className="w-24 h-24 bg-blue-300 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:bg-blue-400 transition-colors"
//         onClick={() => setIsVisible(!isVisible)}
//       >
//         Квадрат
//       </motion.div>
//       {isVisible && (
//         <div className="flex md:ml-5 mt-5 md:mt-0">
//           <div className="mr-5 flex flex-col">
//             <label className="mb-1">Email (Поле 1)</label>
//             <motion.input
//               type="email"
//               value={inputValues[0]}
//               onChange={(e) => handleInputChange(0, e.target.value)}
//               className={`border ${validateEmail(inputValues[0]) ? 'border-gray-300' : 'border-red-500'} rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200`}
//               placeholder="Введите ваш email"
//               required
//             />
//             <label className="mb-1">Поле 2</label>
//             <motion.input
//               type="text"
//               value={inputValues[1]}
//               onChange={(e) => handleInputChange(1, e.target.value)}
//               className={`border ${inputValues[1].trim() ? 'border-gray-300' : 'border-red-500'} rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200`}
//               placeholder="Введите значение"
//               required
//             />
//           </div>

//           <div className="ml-5 flex flex-col">
//             <label className="mb-1">Дополнительные поля</label>
//             {additionalValues.map((value, index) => (
//               <motion.input
//                 key={index}
//                 type="text"
//                 value={value}
//                 onChange={(e) => handleInputChange(index, e.target.value, true)}
//                 className={`border ${value.trim() ? 'border-gray-300' : 'border-red-500'} rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200`}
//                 placeholder={`Доп. поле ${index + 1}`}
//               />
//             ))}
//             <button
//               onClick={handleAddAdditionalField}
//               className="mb-2 text-blue-500 hover:text-blue-700 transition"
//             >
//               Добавить дополнительное поле
//             </button>
//             <motion.button
//               onClick={handleAddToCart}
//               className={`mt-2 p-2 rounded-lg shadow transition ${messages.error ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//             >
//               Добавить в корзину
//             </motion.button>

//             <button
//               onClick={handleClearFields}
//               className="mt-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
//             >
//               Очистить поля
//             </button>

//             {messages.success && (
//               <motion.p
//                 className="text-green-500 mt-2"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 {messages.success}
//               </motion.p>
//             )}
//             {messages.error && (
//               <motion.p
//                 className="text-red-500 mt-2"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 {messages.error}
//               </motion.p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const SquareComponentWithProvider: React.FC = () => {
//   const [messages, setMessages] = useState({ success: '', error: '' });

//   return (
//     <MessageContext.Provider value={[messages, setMessages]}>
//       <SquareComponent />
//     </MessageContext.Provider>
//   );
// };

// export default SquareComponentWithProvider;