import { Order } from '@/app/api/db';
import { NextResponse } from 'next/server';

type StatusBody = {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the params promise first
    const resolvedParams = await params;
    
    // 1. Валидация ID заказа
    const orderId = Number(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Некорректный ID заказа' },
        { status: 400 }
      );
    }

    // 2. Получение и валидация статуса из тела запроса
    const body: StatusBody = await request.json();
    const { status } = body;

    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Некорректный статус заказа' },
        { status: 400 }
      );
    }

    // 3. Обновление статуса в базе данных
    const updatedOrder = await Order.update({status: status} , {where: { id: orderId }});

    // 4. Возвращаем только необходимые данные
    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.status,
    });
    
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить статус заказа' },
      { status: 500 }
    );
  }
}