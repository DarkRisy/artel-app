import { FormStepProps } from '../types';
import FoundationSubform from '../subforms/FoundationSubform';
import LandscapeSubform from '../subforms/LandscapeSubform';
import FarmBuildingSubform from '../subforms/FarmBuildingSubform';
import StorageSubform from '../subforms/StorageSubform';
import LivestockSubform from '../subforms/LivestockSubform';
import GreenhouseSubform from '../subforms/GreenhouseSubform';
import EarthworkSubform from '../subforms/EarthworkSubform';
import RoadSubform from '../subforms/RoadSubform';
import DrainageSubform from '../subforms/DrainageSubform';
import FormNavigation from '../formNavigation';

interface DetailsStepProps extends FormStepProps {
  prevStep: () => void;
  nextStep: () => void;
}

export default function DetailsStep({
  formData,
  onInputChange,
  onCheckboxChange,
  onFileChange,
  onPhoneInput,
  setFormData,
  prevStep,
  nextStep
}: DetailsStepProps) {
  
  const validateForm = () => {
    switch(formData.serviceType) {
      case 'foundation':
        return !!(formData.foundationType && formData.foundationArea);
      case 'landscape':
        return !!(formData.landscapeArea);
      case 'farm_building':
        return !!(formData.farmBuildingType && formData.farmBuildingArea);
      case 'storage':
        return !!(formData.storageType && formData.storageCapacity);
      case 'livestock':
        return !!(formData.livestockType && formData.livestockAnimalsCount);
      case 'greenhouse':
        return !!(formData.greenhouseType && formData.greenhouseArea);
      case 'earthwork':
        return !!(formData.earthworkType && formData.earthworkVolume);
      case 'road':
        return !!(formData.roadLength && formData.roadType);
      case 'drainage':
        return !!(formData.drainageType && formData.drainageLength);
      default:
        return false;
    }
  };

  const isNextDisabled = !validateForm();

  const renderSubform = () => {
    if (!formData.serviceType) return null;
    
    const commonProps = {
      formData,
      onInputChange,
      onCheckboxChange,
      onFileChange,
      onPhoneInput,
      setFormData
    };

    switch(formData.serviceType) {
      case 'foundation': 
        return <FoundationSubform {...commonProps} />;
      case 'landscape': 
        return <LandscapeSubform {...commonProps} />;
      case 'farm_building': 
        return <FarmBuildingSubform {...commonProps} />;
      case 'storage': 
        return <StorageSubform {...commonProps} />;
      case 'livestock': 
        return <LivestockSubform {...commonProps} />;
      case 'greenhouse': 
        return <GreenhouseSubform {...commonProps} />;
      case 'earthwork': 
        return <EarthworkSubform {...commonProps} />;
      case 'road': 
        return <RoadSubform {...commonProps} />;
      case 'drainage': 
        return <DrainageSubform {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-white">2. Детали услуги</h2>
      
      {renderSubform()}

      <FormNavigation 
        onPrev={prevStep} 
        onNext={nextStep} 
        isNextDisabled={isNextDisabled} 
      />
    </div>
  );
}