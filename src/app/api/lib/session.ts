'use server'
// import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const encodedKey = new TextEncoder().encode(process.env.SECRET_KEY)
const response = NextResponse.next();
export type SessionPayload = {
  userId: any,
  expiresAt: Date,
  emailVerified: boolean,
  role: any,
}
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Ошибка верификации сессии пользователя!')
  }
}
export async function createSession(userId: string, role: any, emailVerified: boolean) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt, emailVerified, role })
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: 'strict',
    path: '/',
  })
}
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return response
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
  if (!session || !payload) {
    return null
  }
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
  return response
}