import React, { FormEvent, useState } from 'react'
import Button from './Button'
import { useToast } from '../hooks/use-toast'

const EditProfileModal = ({ 
  userData,
  onSave,
  onClose,
  isOpen
}: {
  userData: any
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

export default EditProfileModal