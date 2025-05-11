'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetch(`http://sk-artel.ru/api/auth/verify-email?token=${token}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Ошибка сервера');
          }
          return res.json();
        })
        .then(data => {
          console.log(data);
          setTimeout(() => router.push('/user'), 1500);
        })
        .catch(err => {
          console.error('Ошибка:', err);
          // Можно добавить обработку ошибки для пользователя
        });
    }
  }, [token, router]);

  return (
    <div className="text-center mt-[120px] p-8">
      <h1 className="text-xl font-semibold mb-4">
        {token ? 'Проверяем ваш email...' : 'Токен не найден'}
      </h1>
      <p>Пожалуйста, подождите, пока мы обрабатываем ваш запрос.</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-[120px]">Загрузка...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}