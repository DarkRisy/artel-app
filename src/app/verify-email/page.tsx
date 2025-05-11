'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    }
  }, [token]);

  return (
    <div className="text-center p-8">
      <h1 className="text-xl font-semibold mb-4">
        {token ? 'Verifying your email...' : 'Token is missing'}
      </h1>
      <p>Please wait while we process your request.</p>
    </div>
  );
}