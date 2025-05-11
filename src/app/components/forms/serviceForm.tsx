'use client';
import { useEffect, useState } from 'react';
import ProgressBar from './progressBar';
import ServiceStep from './steps/serviceStep';
import DetailsStep from './steps/detailsStep';
import ProjectStep from './steps/projectStep';
import ContactStep from './steps/contactStep';
import { FormsData, Product } from './types';
import Image from 'next/image';
import { getData } from '../userServer';

interface ServiceFormProps {
  product?: Product;
  onClose?: () => void;
}

export default function ServiceForm({ product }: ServiceFormProps) {
    const [formData, setFormData] = useState<FormsData>({
        serviceType: '',
        otherService: '',
        foundationType: [],
        foundationArea: '',
        foundationDepth: '',
        landscapeWorks: [],
        landscapeArea: '',
        landscapePavingType: '',
        farmBuildingType: [],
        farmBuildingArea: '',
        farmBuildingHeight: '',
        farmBuildingMaterial: '',
        storageType: '',
        storageCapacity: '',
        storageTemperature: '',
        storageVentilation: '',
        livestockType: '',
        livestockAnimalsCount: '',
        livestockArea: '',
        livestockVentilation: false,
        livestockFeatures: [],
        greenhouseType: '',
        greenhouseArea: '',
        greenhouseHeating: '',
        greenhouseIrrigation: '',
        greenhouseFeatures: [],
        earthworkType: [],
        earthworkVolume: '',
        earthworkDepth: '',
        earthworkEquipment: '',
        earthworkComments: '',
        roadType: '',
        roadLength: '',
        roadWidth: '',
        roadCoating: '',
        roadFeatures: [],
        drainageType: '',
        drainageLength: '',
        drainageDepth: '',
        drainageMaterial: '',
        drainageElements: [],
        location: '',
        timing: '1-3',
        budget: '',
        hasDocs: 'no',
        comments: '',
        attachments: null,
        name: '',
        phone: '',
        email: '',
        contactMethod: [],
        callTime: 'any',
        agree: true,
      });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
 const [isLoadingUser, setIsLoadingUser] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getData();
        setFormData(prev => ({
          ...prev,
          name: userData?.data.Name || '',
          phone: userData?.data.Phone || '',
          email: userData?.data.Email || ''
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        serviceType: product.CategoryId
      }));
      setCurrentStep(2);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'agree') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData(prev => {
      const currentArray = prev[name as keyof FormData] as string[] || [];
      return {
        ...prev,
        [name]: checked 
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachments: e.target.files }));
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '+7 (';
    
    if (value.length > 1) {
      formattedValue += value.substring(1, 4) + ') ';
      if (value.length > 4) formattedValue += value.substring(4, 7) + '-';
      if (value.length > 7) formattedValue += value.substring(7, 9) + '-';
      if (value.length > 9) formattedValue += value.substring(9, 11);
    } else {
      formattedValue = '+7 (';
    }

    setFormData(prev => ({ ...prev, phone: formattedValue }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const formDataToSend = new FormData();

    // Добавляем текстовые данные
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'attachments' && value !== null) {
        if (Array.isArray(value)) {
          // Преобразуем массив в строку с разделителем ", "
          formDataToSend.append(key, value.join(', '));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    if (formData.attachments) {
      Array.from(formData.attachments).forEach(file => {
        formDataToSend.append('files', file);
      });
    }

    const response = await fetch(`http://sk-artel.ru/api/orders`, {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Ошибка при отправке формы');
    console.error('Submission error:', err);
  } finally {
    setIsLoading(false);
    setIsSubmitted(true);
  }
};

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const commonProps = {
    formData,
    onInputChange: handleInputChange,
    onCheckboxChange: handleCheckboxChange,
    onFileChange: handleFileChange,
    onPhoneInput: handlePhoneInput,
    setFormData,
    isLoadingUser
  };

  return (
    <div className="max-w-3xl mt-[120px] mx-auto p-6 border-2 border-[#C34D3F] bg-[#2D3538] rounded-lg shadow-md">
      <div className="flex justify-center mb-6">
        <Image src="./images/logo.svg" alt="Артель" width={64} height={64} className="h-16" />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-4 text-white">
        Оформление заявки на строительные услуги
      </h1>
      
      {isSubmitted ? (
        <div className="bg-[#2D3538] flex flex-col justify-center items-center border border-[#C34D3F] text-white px-4 py-3 rounded mb-4">
          <h3 className="font-bold text-lg mb-2">Спасибо за вашу заявку!</h3>
          <p>Наш специалист свяжется с вами в течение некоторого времени для уточнения деталей.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProgressBar currentStep={currentStep} />
          
          {currentStep === 1 && <ServiceStep {...commonProps} nextStep={nextStep} />}
          {currentStep === 2 && <DetailsStep {...commonProps} nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 3 && <ProjectStep {...commonProps} nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 4 && <ContactStep {...commonProps} prevStep={prevStep} />}
        </form>
      )}
    </div>
  );
}