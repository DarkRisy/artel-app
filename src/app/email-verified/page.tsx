'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function EmailVerifiedPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#2D3538] flex items-center justify-center p-4">
      <div className="bg-[#1E2426] border border-[#C34D3F] rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Email успешно подтвержден!</h1>
        
        <p className="text-gray-300 mb-6">
          Ваш email адрес был успешно подтвержден. Теперь вы можете пользоваться всеми возможностями аккаунта.
        </p>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => router.push('/user')}
            className="bg-[#C34D3F] hover:bg-[#A93F32] text-white"
          >
            Перейти в личный кабинет
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="border-[#C34D3F] text-[#C34D3F] hover:bg-[#F5E9E8]"
          >
            На главную страницу
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Автоматический переход через 5 секунд...
        </p>
      </div>
    </div>
  )
}