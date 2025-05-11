export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface ConstructionStage {
  id: number
  Name: string
  Description: string
  Image_1?: string
  Image_2?: string
  Image_3?: string
  OrderId: number
  createdAt?: string
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ProjectDetails {
  general: {
    budget: string;
    location: string;
    timing: string;
    comments: string;
    hasDocs: string;
  };
  foundation: {
    type: string;
    area: string;
    depth: string;
  };
  landscape: {
    works: string;
    area: string;
    pavingType: string;
  };
  farmBuilding: {
    type: string;
    area: string;
    height: string;
    material: string;
  };
  storage: {
    type: string;
    capacity: string;
    temperature: string;
    ventilation: string;
  };
  livestock: {
    type: string;
    animalsCount: string;
    area: string;
    ventilation: boolean;
    features: string;
  };
  greenhouse: {
    type: string;
    area: string;
    heating: string;
    irrigation: string;
    features: string;
  };
  earthwork: {
    type: string;
    volume: string;
    depth: string;
    equipment: string;
    comments: string;
  };
  road: {
    type: string;
    length: string;
    width: string;
    coating: string;
    features: string;
  };
  drainage: {
    type: string;
    length: string;
    depth: string;
    material: string;
    elements: string;
  };
}

export interface contactInfo {
  contactMethod: string;
  callTime: string;
};
export interface Order {
  id: number;
  serviceType: string;
  attachments: any;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  user: User;
  stages: ConstructionStage[];
  notes?: any[];
  projectDetails: ProjectDetails;
  contactInfo: contactInfo;
}

export const ORDER_TITLES: Record<string, string> = {
  foundation: 'Фундаментные работы',
  drainage: 'Дренажные системы',
  earthwork: 'Земляные работы',
  farm_building: 'Сельскохозяйственные здания',
  greenhouse: 'Тепличные комплексы',
  landscape: 'Благоустройство территории',
  livestock: 'Животноводческие комплексы',
  road: 'Дорожные работы',
  storage: 'Здания для хранения продукции',
}

export const STATUS_CONFIG = {
  pending: {
    class: 'bg-yellow-100 text-yellow-800',
    label: 'В ожидании'
  },
  in_progress: {
    class: 'bg-blue-100 text-blue-800',
    label: 'В работе'
  },
  completed: {
    class: 'bg-green-100 text-green-800',
    label: 'Завершен'
  },
  cancelled: {
    class: 'bg-red-100 text-red-800',
    label: 'Отменен'
  }
} as const


export interface StatusSelectProps {
  currentStatus: OrderStatus;
  orderId: number;
  onChange: (orderId: number, newStatus: OrderStatus) => void;
}

export const getStatusConfig = (status: OrderStatus) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
    class: 'bg-gray-100 text-gray-800',
    label: status
  }
}

export const normalizeString = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ')

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}