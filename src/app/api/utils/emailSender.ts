import nodemailer from 'nodemailer';
import { Order } from '../db';


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
} as const;

export type OrderStatus = keyof typeof STATUS_CONFIG;




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'artelorenburg56@gmail.com',
    pass: 'bbga xfue lgvo rjlo'
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `http://sk-artel/verify-email?token=${token}`;

  await transporter.sendMail({
    from: 'Артель',
    to: email,
    subject: 'Подтвердите адрес электронной почты',
    html: `
      <p>Нажмите для подтверждения адреса электронной почты:</p>
      <a href="${verificationUrl}">Подтвердить адрес</a>
    `
  });
}


export async function sendStageUpdateEmail(
  orderId: number,
  stageName: string,
) {
  const order = await Order.findOne({where: { id: orderId }})
  const mailOptions = {
    from: 'Артель',
    to: order.email,
    subject: `Обновление по вашему заказу #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C34D3F;">Обновление стадий работ по ваему заказу</h2>
        <p>Уважаемый клиент,</p>
        <p>Добавлена новая стадия работ по вашему заказу <strong>#${orderId}</strong>:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #C34D3F;">${stageName}</h3>
        </div>
        
        <p>Вы можете проверить детали в <a href="http://sk-artel/user" style="color: #C34D3F;">личном кабинете</a>.</p>
        <p>С уважением,<br>Команда Артель</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email уведомление отправлено')
  } catch (error) {
    console.error('Ошибка отправки email:', error)
    throw error
  }
}


export async function sendStatusUpdateEmail(
  orderId: number,
  status: OrderStatus,
) {
  const order = await Order.findOne({ where: { id: orderId } });
  
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }

  const statusLabel = STATUS_CONFIG[status]?.label || status;
  
  const mailOptions = {
    from: 'Артель',
    to: order.email,
    subject: `Обновление по вашему заказу #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C34D3F;">Обновление статуса заказа</h2>
        <p>Уважаемый клиент,</p>
        <p>Статус вашего заказа <strong>#${orderId}</strong> был обновлен:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Новый статус:</strong> ${statusLabel}</p>
        </div>
        
        <p>Вы можете проверить детали в <a href="http://sk-artel/user" style="color: #C34D3F;">личном кабинете</a>.</p>
        <p>С уважением,<br>Команда Артель</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email уведомление отправлено')
  } catch (error) {
    console.error('Ошибка отправки email:', error)
    throw error
  }
}