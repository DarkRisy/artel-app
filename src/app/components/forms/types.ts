export type ServiceType = 
  | 'farm_building' | 'storage' | 'livestock' | 'greenhouse'
  | 'landscape' | 'earthwork' | 'foundation' | 'road' | 'drainage'
  | 'other' | '';

  export interface Product {
    id: string;
    Name: string;
    price: number;
    CategoryId: ServiceType;
    image?: string;
  }

  export type FormsData = {
    serviceType: ServiceType;
    otherService: string;
    location: string;
    timing: string;
    budget: string;
    hasDocs: string;
    comments: string;
    attachments: FileList | null;
    name: string;
    phone: string;
    email: string;
    contactMethod: string[];
    callTime: string;
    agree: boolean;
    
    foundationType: string[];
    foundationArea: string;
    foundationDepth: string;
    landscapeWorks: string[];
    landscapeArea: string;
    landscapePavingType: string;
    farmBuildingType: string[];
    farmBuildingArea: string;
    farmBuildingHeight: string;
    farmBuildingMaterial: string;
    storageType: string;
    storageCapacity: string;
    storageTemperature: string;
    storageVentilation: string;
    livestockType: string;
    livestockAnimalsCount: string;
    livestockArea: string;
    livestockVentilation: boolean;
    livestockFeatures: string[];
    greenhouseType: string;
    greenhouseArea: string;
    greenhouseHeating: string;
    greenhouseIrrigation: string;
    greenhouseFeatures: string[];
    earthworkType: string[];
    earthworkVolume: string;
    earthworkDepth: string;
    earthworkEquipment: string;
    earthworkComments: string;
    roadType: string;
    roadLength: string;
    roadWidth: string;
    roadCoating: string;
    roadFeatures: string[];
    drainageType: string;
    drainageLength: string;
    drainageDepth: string;
    drainageMaterial: string;
    drainageElements: string[];
  };

export type FormStepProps = {
  formData: FormsData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormsData>>;
};