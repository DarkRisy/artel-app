'use client'
import React, { FormEvent, useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { logout } from '../api/auth/logout'
import { useToast } from '../hooks/use-toast'
import { DeleteUser, getData, getStage, UpdateUser } from './userServer'
import Modal from './modalStage'
import { ConstructionStage } from './StagesList'
import { resendVerification } from '../api/auth/verify-email/resend-verification'
import { ChangePassword } from '../api/user/user'

export type UserData = {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  emailVerified: boolean
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

type Order = {
  id: string
  name: string
  price: string
  image: string
  createdAt: string
  status: OrderStatus
  stages: ConstructionStage[]
}

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

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'В обработке',
  in_progress: 'В работе',
  completed: 'Завершен',
  cancelled: 'Отменен',
}

const Button = React.memo(({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'outline' | 'danger' | 'ghost'
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: React.ReactNode
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-[#C34D3F] hover:bg-[#A93F32] text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#C34D3F] text-[#C34D3F] hover:bg-[#2D3538]',
    danger: 'bg-[#DC3545] hover:bg-[#C82333] text-white shadow-md hover:shadow-lg',
    ghost: 'text-white hover:bg-[#2D3538]',
  }[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {loading ? (
        <span className="animate-spin">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      ) : icon ? (
        <>
          {icon}
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
})
Button.displayName = 'Button'

const EmailVerificationModal = ({
  isOpen,
  onClose,
  onResendVerification
}: {
  isOpen: boolean
  onClose: () => void
  onResendVerification: () => Promise<void>
}) => {
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()

  const handleResend = async () => {
    try {
      setIsResending(true)
      await onResendVerification()
      toast({
        title: 'Письмо отправлено',
        description: 'Новое письмо с подтверждением отправлено на ваш email',
      })
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить письмо',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D3538] rounded-xl p-6 max-w-md w-full border border-[#C34D3F]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Подтвердите ваш email</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-center bg-[#3A4548] p-4 rounded-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#C34D3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-300">
            Для полного доступа к аккаунту необходимо подтвердить ваш email адрес.
            Проверьте вашу почту и перейдите по ссылке в письме.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleResend}
            loading={isResending}
            className="flex-1"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            Отправить повторно
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isResending}
            className="flex-1"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}

const OrderCard = React.memo(({ order }: { order: Order }) => {
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

const EditProfileModal = ({ 
  userData,
  onSave,
  onClose,
  isOpen
}: {
  userData: UserData
  onSave: (data: { name: string; phone: string }) => Promise<void>
  onClose: () => void
  isOpen: boolean
}) => {
  const [name, setName] = useState(userData.name)
  const [phone, setPhone] = useState(userData.phone)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({ name, phone })
      toast({
        title: 'Данные сохранены',
        description: 'Ваши изменения успешно применены',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D3538] rounded-xl p-6 max-w-md w-full border border-[#C34D3F]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Редактировать профиль</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Имя</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#3A4548] border border-[#3A4548] rounded-lg text-white focus:border-[#C34D3F] focus:ring-1 focus:ring-[#C34D3F]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Телефон</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-[#3A4548] border border-[#3A4548] rounded-lg text-white focus:border-[#C34D3F] focus:ring-1 focus:ring-[#C34D3F]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              loading={isSubmitting}
              className="flex-1"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            >
              Сохранить
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ChangePasswordModal = ({ 
  onClose,
  isOpen
}: {
  onClose: () => void
  isOpen: boolean
}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Новые пароли не совпадают',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await ChangePassword({ currentPassword, newPassword})
      toast({
        title: 'Пароль изменен',
        description: 'Ваш пароль был успешно обновлен',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить пароль',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D3538] rounded-xl p-6 max-w-md w-full border border-[#C34D3F]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Смена пароля</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">Текущий пароль</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#3A4548] border border-[#3A4548] rounded-lg text-white focus:border-[#C34D3F] focus:ring-1 focus:ring-[#C34D3F]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">Новый пароль</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#3A4548] border border-[#3A4548] rounded-lg text-white focus:border-[#C34D3F] focus:ring-1 focus:ring-[#C34D3F]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#3A4548] border border-[#3A4548] rounded-lg text-white focus:border-[#C34D3F] focus:ring-1 focus:ring-[#C34D3F]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              loading={isSubmitting}
              className="flex-1"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              Изменить пароль
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ProfileSection = ({ 
  userData,
  onEditClick,
  onChangePasswordClick,
  onLogout,
  onDeleteAccount
}: {
  userData: UserData
  onEditClick: () => void
  onChangePasswordClick: () => void
  onLogout: () => void
  onDeleteAccount: () => void
}) => (
  <section className="bg-[#2D3538] rounded-xl border border-[#3A4548] shadow-sm p-6">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#C34D3F] mb-4 group">
          <Image
            src={userData?.avatar || '/images/default-avatar.svg'}
            alt="Аватар пользователя"
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            loading='lazy'
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Изменить</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white mb-6">Мой профиль</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-400">Имя</span>
            <div className="text-white font-medium">{userData?.name}</div>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-400">Email</span>
            <div className="text-white font-medium">{userData?.email}</div>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-400">Телефон</span>
            <div className="text-white font-medium">{userData?.phone || 'Не указан'}</div>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-400">Статус</span>
            <div className="text-white font-medium">
              {userData?.emailVerified ? (
                <span className="text-green-400">Подтвержден</span>
              ) : (
                <span className="text-yellow-400">Требуется подтверждение</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={onEditClick}
            className="flex-1 sm:flex-none"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Редактировать
          </Button>
          
          <Button
            variant="outline"
            onClick={onChangePasswordClick}
            className="flex-1 sm:flex-none"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          >
            Пароль
          </Button>
          
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1 sm:flex-none"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            }
          >
            Выйти
          </Button>
          
          <Button
            variant="danger"
            onClick={onDeleteAccount}
            className="flex-1 sm:flex-none"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  </section>
)

const OrdersSection = ({ orders }: { orders: Order[] }) => (
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

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadAccountData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [userRes, ordersRes] = await Promise.all([getData(), getStage()])

      const user: UserData = {
        id: userRes.data.id,
        name: userRes.data.Name,
        email: userRes.data.Email,
        phone: userRes.data.Phone,
        avatar: userRes.data.avatar,
        emailVerified: Boolean(userRes.data.emailVerified)
      }
      setUserData(user)
      
      if (!user.emailVerified) {
        setShowVerificationModal(true)
      }

      setOrders(
        ordersRes.ordersWithStages.map((order: any) => ({
          id: order.id,
          name: order.serviceType,
          price: order.budget,
          image: order.attachments,
          createdAt: order.createdAt,
          status: (order.status || 'pending') as OrderStatus,
          stages: order.stages || [],
        }))
      )

    } catch (error) {
      console.error('Failed to load account data:', error)
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные аккаунта',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const resendVerificationEmail = useCallback(async () => {
    try {
      await resendVerification()
    } catch (error) {
      throw error
    }
  }, [])

  useEffect(() => {
    loadAccountData()
  }, [loadAccountData])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.log('Logout failed:', error)
    }
  }, [toast])

  const handleSaveProfile = useCallback(async (data: { name: string; phone: string }) => {
    try {
      await UpdateUser({
        id: userData?.id || '',
        Name: data.name,
        Phone: data.phone
      })
      setUserData(prev => prev ? { ...prev, ...data } : null)
    } catch (error) {
      throw error
    }
  }, [userData?.id])

  const handleDeleteAccount = useCallback(async () => {
    if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) return

    try {
      if (userData?.id) {
        await DeleteUser({ id: userData.id })
      }
      await logout()
      toast({
        title: 'Аккаунт удален',
        description: 'Ваш аккаунт был успешно удален',
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Deletion failed:', error)
      toast({
        title: 'Ошибка удаления',
        description: 'Не удалось удалить аккаунт',
        variant: 'destructive',
      })
    }
  }, [userData?.id, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2D3538] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C34D3F] mx-auto mb-4"></div>
          <p className="text-gray-300">Загрузка вашего профиля...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#2D3538] flex items-center justify-center">
        <div className="text-center p-6 bg-[#3A4548] rounded-xl shadow-md max-w-md border border-[#C34D3F]">
          <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Ошибка загрузки</h2>
          <p className="text-gray-300 mb-6">Не удалось загрузить данные пользователя</p>
          <Button onClick={loadAccountData}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-[120px] bg-[#2D3538] pb-12">
      <EmailVerificationModal
        isOpen={showVerificationModal && !userData?.emailVerified}
        onClose={() => setShowVerificationModal(false)}
        onResendVerification={resendVerificationEmail}
      />

      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <ProfileSection
            userData={userData}
            onEditClick={() => setShowEditModal(true)}
            onChangePasswordClick={() => setShowPasswordModal(true)}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
          
          <OrdersSection orders={orders} />
        </div>
      </div>

      {userData && (
        <>
          <EditProfileModal
            userData={userData}
            onSave={handleSaveProfile}
            onClose={() => setShowEditModal(false)}
            isOpen={showEditModal}
          />
          
          <ChangePasswordModal
            onClose={() => setShowPasswordModal(false)}
            isOpen={showPasswordModal}
          />
        </>
      )}
    </div>
  )
}