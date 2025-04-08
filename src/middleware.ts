'use server'
import { decrypt } from '@/app/api/lib/session'
import { cookies } from 'next/dist/server/request/cookies'
import { NextRequest, NextResponse } from 'next/server'

 
const protectedRoutes = ['/user']
const publicRoutes = ['/auth', '/register']
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  console.log(path)
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl))
  }
  if (
    isPublicRoute &&
    session?.userId &&
    session?.role == "Пользователь" &&
    !req.nextUrl.pathname.startsWith('/user')
  ) {
    return NextResponse.redirect(new URL('/user', req.nextUrl))
  }
  if (
    isPublicRoute &&
    session?.userId &&
    session?.role == "Администратор" &&
    !req.nextUrl.pathname.startsWith('/user')
  ) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
