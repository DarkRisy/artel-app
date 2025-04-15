'use client'
import React, { FormEvent, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { logout } from '../api/auth/logout'
import { deleteAccount } from '../api/auth/deleteUser'
import { useToast } from '../hooks/use-toast'
import { DeleteUser, getData, getOrder, getStage, UpdateUser } from './userServer'
import StagesList, { ConstructionStage } from './StagesList'
import Modal from './modalStage'

type UserData = {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
}
type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'
type Order = {
    id: string
    name: string
    price: number
    image: string
    createdAt: string
    status: OrderStatus
    stages: ConstructionStage
}

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    icon
}: {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'outline' | 'danger'
    disabled?: boolean
    loading?: boolean
    className?: string
    icon?: React.ReactNode
}) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-[#C34D3F] hover:bg-[#A93F32] text-white shadow-md hover:shadow-lg',
        outline: 'border-2 border-[#C34D3F] text-[#C34D3F] hover:bg-[#F5E9E8]',
        danger: 'bg-[#DC3545] hover:bg-[#C82333] text-white shadow-md hover:shadow-lg'
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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            ) : icon}
            {children}
        </button>
    )
}

// Компонент иконки
const Icon = ({
    name,
    size = 5,
    color = 'currentColor'
}: {
    name: 'user' | 'email' | 'phone' | 'trash' | 'cart' | 'refresh'
    size?: number
    color?: string
}) => {
    const icons = {
        user: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        ),
        email: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        ),
        phone: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        ),
        trash: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        ),
        cart: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        ),
        refresh: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        )
    }
    return (
        <svg className={`w-${size} h-${size}`} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {icons[name]}</svg>
    )
}
// Компонент карточки заказа
const OrderCard = React.memo(({ order }: { order: Order & { stages: ConstructionStage[] } }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800'
    }[order.status]

    const statusLabels = {
        pending: 'В обработке',
        completed: 'Завершен',
        cancelled: 'Отменен',
        refunded: 'Возврат'
    }[order.status]

    return (
        <><article className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-[#C34D3F]">
            <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                    src={order.image}
                    alt={`Заказ: ${order.name}`}
                    fill
                    className="object-cover z-10"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy" />
                <span className={`absolute z-20 top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                    {statusLabels}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2">
                    {order.id}, {order.name}
                </h3>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-[#C34D3F]">
                        {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0
                        }).format(order.price)}
                    </span>
                    <time
                        dateTime={order.createdAt}
                        className="text-sm text-white"
                        title={new Date(order.createdAt).toLocaleString('ru-RU')}
                    >
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </time>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 text-white"
                >
                    Показать этапы заказа
                </button>
            </div>
        </article><Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stages={order.stages} /></>
    )
})
OrderCard.displayName = 'OrderCard'

// Основной компонент
export default function AccountPage() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    // Загрузка данных
    const loadAccountData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [userRes, ordersRes] = await Promise.all([
                getData(),
                getStage()
            ]);

            setUserData({
                id: userRes.data.id,
                name: userRes.data.Name,
                email: userRes.data.Email,
                phone: userRes.data.Phone,
                avatar: userRes.data.avatar
            });

            setOrders(ordersRes.ordersWithStages.map((order: any) => ({
                id: order.id,
                name: order.Name,
                price: order.Price,
                image: order.Image,
                createdAt: order.createdAt,
                status: order.status || 'completed',
                stages: order.stages || [] // стадии
            })));
        } catch (error) {
            console.error('Failed to load account data:', error);
            toast({
                title: 'Ошибка загрузки',
                description: 'Не удалось загрузить данные аккаунта',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadAccountData()
    }, [loadAccountData])

    // Обработчик формы
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData(e.currentTarget)
            const updates = {
                id: userData?.id || '',
                Name: formData.get('name') as string,
                Email: formData.get('email') as string,
                Phone: formData.get('phone') as string
            }

            await UpdateUser(updates)
            setUserData(prev => prev ? { ...prev, ...updates } : null)

            toast({
                title: 'Данные сохранены',
                description: 'Ваши изменения успешно применены'
            })
        } catch (error) {
            console.error('Update failed:', error)
            toast({
                title: 'Ошибка',
                description: 'Не удалось сохранить изменения',
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Выход из аккаунта
    const handleLogout = () => {
        try {
            logout()
            toast({
                title: 'Выход выполнен',
                description: 'Вы успешно вышли из системы'
            })
        } catch (error) {
            console.error('Logout failed:', error)
            toast({
                title: 'Ошибка выхода',
                description: 'Не удалось выйти из системы',
                variant: 'destructive'
            })
        }
    }

    // Удаление аккаунта
    const handleDeleteAccount = () => {
        if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) return

        try {
            if (userData?.id) {
                DeleteUser({ id: userData.id })
            }
            deleteAccount()
            toast({
                title: 'Аккаунт удален',
                description: 'Ваш аккаунт был успешно удален'
            })
        } catch (error) {
            console.error('Deletion failed:', error)
            toast({
                title: 'Ошибка удаления',
                description: 'Не удалось удалить аккаунт',
                variant: 'destructive'
            })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#2D3538] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C34D3F]" />
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-[#2D3538] flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                    <Icon name="cart" size={12} />
                    <h2 className="text-xl font-bold text-[#2D3538] mb-2">Ошибка загрузки</h2>
                    <p className="text-[#2D3538] mb-4">Не удалось загрузить данные пользователя</p>
                    <Button
                        onClick={loadAccountData}
                        icon={<Icon name="refresh" size={4} color="white" />}
                    >
                        Попробовать снова
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-[100px] min-h-screen bg-[#2D3538]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Секция профиля */}
                    <section className="border border-[#C34D3F] rounded-xl shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-white mb-6">Мой профиль</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#C34D3F] mb-4">
                                        <Image
                                            src={userData.avatar || '/images/default-avatar.svg'}
                                            alt="Аватар пользователя"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    {/* <Button
                                        variant="outline"
                                        type="button"
                                        className="text-sm px-3 py-1 rounded-full"
                                        icon={<Icon name="user" size={3} color="#C34D3F" />}
                                    >
                                        Изменить фото
                                    </Button> */}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-white">
                                            Имя
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                name="name"
                                                defaultValue={userData.name}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-2 pl-10 bg-[#2D3538] border border-[#C34D3F] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent text-white"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Icon name="user" color="#C34D3F" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={userData.email}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-2 pl-10 bg-[#2D3538] border border-[#C34D3F] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent text-white"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Icon name="email" color="#C34D3F" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-white">
                                            Телефон
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                defaultValue={userData.phone}
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-2 pl-10 bg-[#2D3538] border border-[#C34D3F] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent text-white"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Icon name="phone" color="#C34D3F" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    className="flex-1 sm:flex-none"
                                >
                                    Сохранить изменения
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => handleLogout()}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none"
                                >
                                    Выйти
                                </Button>

                                <Button variant="danger" onClick={() => handleDeleteAccount()} disabled={isSubmitting} className="flex-1 sm:flex-none" icon={<Icon name="trash" size={4} color="white" />}>
                                    Удалить аккаунт
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* Секция заказов */}
                    <section className="bg-[#2D3538] rounded-xl  border border-[#C34D3F] shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Мои заказы</h2>
                            {orders.length > 0 && (
                                <span className="text-sm text-white">
                                    Всего: {orders.length}
                                </span>
                            )}
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-white mb-2">Нет заказов</h3>
                                <p className="text-white max-w-md mx-auto">
                                    Здесь будут отображаться ваши заказы, когда вы их сделаете
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {orders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}