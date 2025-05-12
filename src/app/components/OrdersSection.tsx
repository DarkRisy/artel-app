import React from 'react'
import OrderCard from './OrderCard'

const OrdersSection = ({ orders }: { orders: any[] }) => (
  <section className="bg-[#2D3538] rounded-xl border border-[#3A4548] shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Мои заказы</h2>
      {orders.length > 0 && (
        <span className="text-sm text-gray-400">Всего: {orders.length}</span>
      )}
    </div>
    {orders.length === 0 ? (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-[#3A4548] rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#C34D3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Нет заказов</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Здесь будут отображаться ваши заказы, когда вы их сделаете
        </p>
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    )}
  </section>
)

export default OrdersSection