import React from 'react'
import Image from 'next/image'
import Button from './Button'

const ProfileSection = ({ 
  userData,
  onEditClick,
  onChangePasswordClick,
  onLogout,
  onDeleteAccount
}: {
  userData: any
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

export default ProfileSection