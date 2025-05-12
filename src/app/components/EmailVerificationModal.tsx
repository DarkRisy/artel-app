import React, { useState } from 'react'
import Button from './Button'
import { useToast } from '../hooks/use-toast'

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

export default EmailVerificationModal