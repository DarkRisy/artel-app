// 'use server'
import { decrypt } from '@/app/api/lib/session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Конфигурация маршрутов
const PUBLIC_ROUTES = ['/', '/auth', '/register', '/about']
const PROTECTED_ROUTES = ['/admin', '/manager', '/user']
const ROLE_BASE_ROUTES: Record<string, string> = {
  admin: '/admin',
  manager: '/manager',
  user: '/user'
}

type UserRole = 'user' | 'admin' | 'manager'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(`${route}/`) || pathname === route
  )

  // Получаем сессию
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // Обработка неавторизованных пользователей
  if (!session?.userId) {
    if (isPublicRoute) {
      return NextResponse.next()
    }

    if (isProtectedRoute) {
      const loginUrl = new URL('/auth', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // Нормализация роли пользователя
  const normalizeRole = (role: unknown): UserRole => {
    if (typeof role !== 'string') return 'user'
    const roleLower = role.toLowerCase()
    if (roleLower === 'admin' || roleLower === 'администратор') return 'admin'
    if (roleLower === 'manager' || roleLower === 'менеджер') return 'manager'
    return 'user'
  }

  const userRole = normalizeRole(session.role)
  const userBaseRoute = ROLE_BASE_ROUTES[userRole] || '/user'

  // Перенаправление авторизованных пользователей с auth/register
  if (pathname.startsWith('/auth') || pathname.startsWith('/register')) {
    return NextResponse.redirect(new URL(userBaseRoute, req.url))
  }

  // Проверка доступа к ролевым маршрутам
  if (isProtectedRoute) {
    const isAllowedRoute = pathname.startsWith(userBaseRoute)
    
    if (!isAllowedRoute) {
      return NextResponse.redirect(new URL(userBaseRoute, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)'
  ]
}