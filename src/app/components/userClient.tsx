import React, { useCallback, useEffect, useState } from 'react'
import { logout } from '../api/auth/logout'
import { useToast } from '../hooks/use-toast'
import { DeleteUser, getData, getStage, UpdateUser } from './userServer'
import { resendVerification } from '../api/auth/verify-email/resend-verification'
import EmailVerificationModal from './EmailVerificationModal'
import ProfileSection from './ProfileSection'
import OrdersSection from './OrdersSection'
import EditProfileModal from './EditProfileModal'
import ChangePasswordModal from './ChangePasswordModal'
import Button from './Button'

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadAccountData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [userRes, ordersRes] = await Promise.all([getData(), getStage()])

      const user = {
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
          status: (order.status || 'pending'),
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