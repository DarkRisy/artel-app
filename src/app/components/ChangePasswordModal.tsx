import React, { FormEvent, useState } from 'react'
import Button from './Button'
import { useToast } from '../hooks/use-toast'
import { ChangePassword } from '../api/user/user'

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

export default ChangePasswordModal