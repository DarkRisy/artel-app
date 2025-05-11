'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function VerifyEmailComponent({ token }: { token: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(token ? 'verifying' : 'error');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Токен верификации отсутствует');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        
        if (!response.ok) {
          throw new Error('Ошибка сервера');
        }

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setTimeout(() => router.push('/user'), 1500); // Редирект через 1.5 секунды
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Не удалось подтвердить email');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        console.error('Ошибка верификации:', error);
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="text-center mt-[120px] p-8">
      {status === 'verifying' && (
        <>
          <h1 className="text-xl font-semibold mb-4">Идет подтверждение email...</h1>
          <p>Пожалуйста подождите...</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <h1 className="text-xl font-semibold mb-4 text-green-600">Email успешно подтвержден!</h1>
          <p>Перенаправляем вас в личный кабинет...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h1 className="text-xl font-semibold mb-4 text-red-600">Ошибка подтверждения</h1>
          <p className="text-red-500 mb-4">{errorMessage}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Вернуться на главную
          </button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  return (
    <Suspense fallback={<div className="text-center mt-[120px] p-8">Загрузка...</div>}>
      <VerifyEmailComponent token={searchParams.token || null} />
    </Suspense>
  );
}