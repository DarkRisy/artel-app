'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetch(`http://sk-artel.ru/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    }
    setTimeout(() => router.push('/user'), 1500);
  }, [token]);

  return (
    <div className="text-center p-8">
      <h1 className="text-xl font-semibold mb-4">
        {token ? 'Проверяем ваш email...' : 'Токен не найден'}
      </h1>
      <p>Пожалуйста, подождите, пока мы обрабатываем ваш запрос.</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}