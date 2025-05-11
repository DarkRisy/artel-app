'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetch(`http://sk-artel.ru/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');

            setTimeout(() => router.push('/user'), 2000);
          } else {
            setStatus('error');
            setError(data.error || 'Verification failed');
          }
        })
        .catch(err => {
          setStatus('error');
          setError('Network error');
          console.error('Error:', err);
        });
    } else {
      setStatus('error');
      setError('Token is missing');
    }
  }, [token, router]);

  return (
    <div className="text-center p-8">
      {status === 'loading' && (
        <>
          <h1 className="text-xl font-semibold mb-4">Проверяем ваш email...</h1>
          <p>Пожалуйста, подождите, пока мы обрабатываем ваш запрос.</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <h1 className="text-xl font-semibold mb-4 text-green-600">Email подтвержден!</h1>
          <p>Перенаправляем в профиль...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h1 className="text-xl font-semibold mb-4 text-red-600">Ошибка подтверждения</h1>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            На главную
          </button>
        </>
      )}
    </div>
  );
}