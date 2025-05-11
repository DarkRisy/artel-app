import React from 'react'
import { Order, OrderStatus } from './types'
import { NoDataMessage } from './ui/NoDataMessage'
import { OrderCard } from './OrderCard'


interface OrderListProps {
  orders: Order[]
  searchTerm: string
  onStageAdded: () => void
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void
}

const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  searchTerm, 
  onStageAdded, 
  onStatusChange 
}) => {
  if (orders.length === 0) {
    return <NoDataMessage searchTerm={searchTerm} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map(order => (
        <OrderCard
          key={`${order.id}-${order.createdAt}`}
          order={order}
          onStageAdded={onStageAdded}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

export default OrderList