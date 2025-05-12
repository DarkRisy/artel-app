import React, { useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import Modal from './modalStage'
import { ConstructionStage } from './StagesList'

const ORDER_TITLES: Record<string, string> = {
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

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'В обработке',
  in_progress: 'В работе',
  completed: 'Завершен',
  cancelled: 'Отменен',
}

const OrderCard = React.memo(({ order }: { order: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const orderTitle = ORDER_TITLES[order.name] || order.name

  return (
    <>
      <article className="bg-[#2D3538] flex flex-col justify-between rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-[#3A4548] hover:border-[#C34D3F] group">
        <div className="relative aspect-[4/3] bg-gray-100  ">
          <Image
            src={`/images/${order.name}.svg`}
            alt={`Заказ: ${order.id}`}
            fill
            className="object-cover z-10"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <span className={`absolute z-20 top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-white line-clamp-2">
              {orderTitle}
            </h3>
            <span className="font-bold text-[#C34D3F] whitespace-nowrap ml-2">
              {order.price}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>№ {order.id}</span>
            <time
              dateTime={order.createdAt}
              title={new Date(order.createdAt).toLocaleString('ru-RU')}
            >
              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
            </time>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="ghost"
            className="w-full group-hover:bg-[#3A4548]"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            Показать этапы
          </Button>
        </div>
      </article>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stages={order.stages}
      />
    </>
  )
})

OrderCard.displayName = 'OrderCard'

export default OrderCard