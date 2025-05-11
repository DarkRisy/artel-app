'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function VerifyEmailComponent({ token }: { token: string | null }) {
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Редирект на профиль после успешной верификации
            router.push('/user');
          } else {
            console.error('Verification failed:', data.error);
          }
        })
        .catch(err => console.error('Error:', err));
    }
  }, [token, router]);

  return (
    <div className="text-center mt-[120px] p-8">
      <h1 className="text-xl font-semibold mb-4">
        {token ? 'Verifying your email...' : 'Token is missing'}
      </h1>
      <p>Пожалуйста подождите...</p>
    </div>
  );
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <VerifyEmailComponent token={searchParams.token || null} />
    </Suspense>
  );
}