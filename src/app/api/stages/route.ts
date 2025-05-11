import { NextResponse } from 'next/server';
import { ConstructionStage } from '../db';



// Создание нового этапа
export async function POST(request: Request) {
  try {
    const { Name, Description, OrderId, Image_1, Image_2, Image_3} = await request.json();

    // Валидация обязательных полей
    if (!Name || !Description || !OrderId) {
      return NextResponse.json(
        { message: 'Name, description and order ID are required' },
        { status: 400 }
      );
    }
   
    const stageData = {
      Name,
      Description,
      order_id: OrderId,
      image_1: Image_1[0] || '',
      image_2: Image_2[0] || '',
      image_3: Image_3[0] || '',

    };
    const data = await ConstructionStage.create({
        Name: stageData.Name,
        Description: stageData.Description,
        OrderId: stageData.order_id,
        Image_1: stageData.image_1,
        Image_2: stageData.image_2,
        Image_3: stageData.image_3,

    })



    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating stage:', error);
    return NextResponse.json(
      { message: 'Failed to create stage' },
      { status: 500 }
    );
  }
}