'use server'
import axios from 'axios';
import { sendStageUpdateEmail, sendStatusUpdateEmail } from '../api/utils/emailSender';
import { ConstructionStage, Order, OrderStatus } from './manager/types';

const API_BASE_URL = process.env.BASE_URL;


// Базовый обработчик для преобразования данных заказа
const transformOrderData = (order: any): Order => ({
  id: order.id,
  serviceType: order.serviceType,
  attachments: order.attachments,
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  contactInfo: {
    contactMethod: order.contactMethod,
    callTime: order.callTime,
  },
  user: {
    id: order.user?.id || order.User?.id,
    name: order.user?.name || order.User?.Name || '',
    email: order.user?.email || order.User?.Email || '',
    phone: order.user?.phone || order.User?.Phone || '',
  },

  stages: (order.stages || order.ConstructionStages || []).map((stage: any) => ({
    id: stage.id,
    Name: stage.Name || stage.name,
    Description: stage.Description || stage.description,
    Image_1: stage.Image_1 || (stage.images?.[0] || null),
    Image_2: stage.Image_2 || (stage.images?.[1] || null),
    Image_3: stage.Image_3 || (stage.images?.[2] || null),
    OrderId: stage.OrderId || order.id,
    createdAt: stage.createdAt
  })),

  notes: order.notes || [],

  projectDetails: {
    general: {
      budget: order.budget || order.projectDetails?.general?.budget || '',
      location: order.location || order.projectDetails?.general?.location || '',
      timing: order.timing || order.projectDetails?.general?.timing || '',
      comments: order.comment || order.projectDetails?.general?.comment || '',
      hasDocs: order.hasDocs || order.projectDetails?.general?.hasDocs || 'no',

    },
    foundation: {
      type: order.foundationType || order.projectDetails?.foundation?.type || [],
      area: order.foundationArea || order.projectDetails?.foundation?.area || '',
      depth: order.foundationDepth || order.projectDetails?.foundation?.depth || ''
    },
    landscape: {
      works: order.landscapeWorks || order.projectDetails?.landscape?.works || [],
      area: order.landscapeArea || order.projectDetails?.landscape?.area || '',
      pavingType: order.landscapePavingType || order.projectDetails?.landscape?.pavingType || ''
    },
    farmBuilding: {
      type: order.farmBuildingType || order.projectDetails?.farmBuilding?.type || [],
      area: order.farmBuildingArea || order.projectDetails?.farmBuilding?.area || '',
      height: order.farmBuildingHeight || order.projectDetails?.farmBuilding?.height || '',
      material: order.farmBuildingMaterial || order.projectDetails?.farmBuilding?.material || ''
    },
    storage: {
      type: order.storageType || order.projectDetails?.storage?.type || '',
      capacity: order.storageCapacity || order.projectDetails?.storage?.capacity || '',
      temperature: order.storageTemperature || order.projectDetails?.storage?.temperature || '',
      ventilation: order.storageVentilation || order.projectDetails?.storage?.ventilation || ''
    },
    livestock: {
      type: order.livestockType || order.projectDetails?.livestock?.type || '',
      animalsCount: order.livestockAnimalsCount || order.projectDetails?.livestock?.animalsCount || '',
      area: order.livestockArea || order.projectDetails?.livestock?.area || '',
      ventilation: order.livestockVentilation || order.projectDetails?.livestock?.ventilation || false,
      features: order.livestockFeatures || order.projectDetails?.livestock?.features || []
    },
    greenhouse: {
      type: order.greenhouseType || order.projectDetails?.greenhouse?.type || '',
      area: order.greenhouseArea || order.projectDetails?.greenhouse?.area || '',
      heating: order.greenhouseHeating || order.projectDetails?.greenhouse?.heating || '',
      irrigation: order.greenhouseIrrigation || order.projectDetails?.greenhouse?.irrigation || '',
      features: order.greenhouseFeatures || order.projectDetails?.greenhouse?.features || []
    },
    earthwork: {
      type: order.earthworkType || order.projectDetails?.earthwork?.type || [],
      volume: order.earthworkVolume || order.projectDetails?.earthwork?.volume || '',
      depth: order.earthworkDepth || order.projectDetails?.earthwork?.depth || '',
      equipment: order.earthworkEquipment || order.projectDetails?.earthwork?.equipment || '',
      comments: order.earthworkComments || order.projectDetails?.earthwork?.comments || ''
    },
    road: {
      type: order.roadType || order.projectDetails?.road?.type || '',
      length: order.roadLength || order.projectDetails?.road?.length || '',
      width: order.roadWidth || order.projectDetails?.road?.width || '',
      coating: order.roadCoating || order.projectDetails?.road?.coating || '',
      features: order.roadFeatures || order.projectDetails?.road?.features || []
    },
    drainage: {
      type: order.drainageType || order.projectDetails?.drainage?.type || '',
      length: order.drainageLength || order.projectDetails?.drainage?.length || '',
      depth: order.drainageDepth || order.projectDetails?.drainage?.depth || '',
      material: order.drainageMaterial || order.projectDetails?.drainage?.material || '',
      elements: order.drainageElements || order.projectDetails?.drainage?.elements || []
    }
  },


  userId: 0
});

// Получение всех заказов с пользователями и стадиями
export const getOrdersWithStages = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`http://92.242.60.192/api/orders`);
    console.log(transformOrderData)
    return response.data.map(transformOrderData);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Тип для данных нового этапа с файлами
export type NewStageData = {
  Name: string;
  Description: string;
  OrderId: number;
  files?: File[];
};

// Добавление нового этапа с загрузкой изображений
export const addStageWithImages = async (stageData: NewStageData): Promise<ConstructionStage> => {
  try {
    // 1. Загружаем изображения, если они есть
    const imageUrls: string[] = [];

    if (stageData.files && stageData.files.length > 0) {
      for (const file of stageData.files.slice(0, 3)) { // Максимум 3 изображения
        const formData = new FormData();
        formData.append('files', file);

        const uploadResponse = await axios.post(`http://92.242.60.192/api/uploadPhotoStage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (uploadResponse.data.url) {
          imageUrls.push(uploadResponse.data.url);
        }
      }
    }

    // 2. Подготавливаем данные этапа
    const stagePayload = {
      Name: stageData.Name,
      Description: stageData.Description,
      OrderId: stageData.OrderId,
      Image_1: imageUrls[0] || '',
      Image_2: imageUrls[1] || '',
      Image_3: imageUrls[2] || ''
    };

    // 3. Создаем этап
    const response = await axios.post(`http://92.242.60.192/api/stages`, stagePayload);
    sendStageUpdateEmail(stageData.OrderId, stageData.Name)
    return {
      id: response.data.id,
      Name: response.data.Name,
      Description: response.data.Description,
      Image_1: response.data.Image_1,
      Image_2: response.data.Image_2,
      Image_3: response.data.Image_3,
      OrderId: response.data.OrderId,
      createdAt: response.data.createdAt
    };

  } catch (error) {
    console.error('Error adding stage with images:', error);
    throw error;
  }
};

// Обновление статуса заказа
export const updateOrderStatus = async (
  orderId: number,
  newStatus: OrderStatus
): Promise<Order> => {
  try {
    const response = await axios.patch(
      `http://92.242.60.192/api/orders/${orderId}/status`,
      { status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data) {
      throw new Error('Пустой ответ от сервера');
    }
    const updatedOrder = transformOrderData(response.data);
    sendStatusUpdateEmail(orderId, newStatus)
    return updatedOrder;
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    throw error;
  }
};
