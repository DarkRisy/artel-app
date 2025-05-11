'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { getOrdersWithStages, updateOrderStatus } from './managerServer'
import { normalizeString, Order, ORDER_TITLES, OrderStatus, STATUS_CONFIG } from './manager/types'
import OrderList from './manager/OrderList'
import SearchAndFilter from './manager/SearchAndFilter'
import { useToast } from '../hooks/use-toast'
import { Loader } from './manager/ui/Loader'

const OrdersPage = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof Order; 
    direction: 'asc' | 'desc' 
  } | null>(null)
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getOrdersWithStages()
      setAllOrders(data)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные заказов',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => { loadData() }, [loadData])

    const filteredOrders = useMemo(() => {
    const normalizedSearchTerm = normalizeString(searchTerm)

    let result = allOrders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (!normalizedSearchTerm) return true
      if (order.id.toString().includes(normalizedSearchTerm)) return true

      const userFields = [
        order.user.name,
        order.user.email,
        order.user.phone
      ].filter(Boolean).join(' ')

      if (normalizeString(userFields).includes(normalizedSearchTerm)) return true

      const orderFields = [
        order.projectDetails.general.budget,
        order.projectDetails.general.location,
        order.projectDetails.general.timing,
        order.notes
      ].filter(Boolean).join(' ')

      if (normalizeString(orderFields).includes(normalizedSearchTerm)) return true

      const serviceTypeMatch =
        normalizeString(order.serviceType).includes(normalizedSearchTerm) ||
        (ORDER_TITLES[order.serviceType] &&
          normalizeString(ORDER_TITLES[order.serviceType]).includes(normalizedSearchTerm))

      if (serviceTypeMatch) return true

      return order.stages.some(stage =>
        normalizeString(`${stage.Name} ${stage.Description}`).includes(normalizedSearchTerm))
    })

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === undefined || bValue === undefined) {
          return aValue === undefined ? 1 : -1
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return result
  }, [allOrders, searchTerm, statusFilter, sortConfig])

  const requestSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {

      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await updateOrderStatus(orderId, newStatus);

      toast({
        title: 'Статус обновлен',
        description: `Статус заказа #${orderId} изменен на "${STATUS_CONFIG[newStatus].label}"`,
      });
    } catch (error) {

      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: order.status } : order
        )
      );
      console.error('Failed to update order status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус заказа',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen mt-[120px] bg-[#2D3538] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Управление заказами</h1>

        <SearchAndFilter
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <OrderList
          orders={filteredOrders}
          searchTerm={searchTerm}
          onStageAdded={loadData}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  )
}

export default OrdersPage