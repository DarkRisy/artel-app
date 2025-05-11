import { NextResponse } from 'next/server'
import { verifyEmailToken } from '../../lib/auth'


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    );
  }

  try {
    const result = await verifyEmailToken(token)

    if (result.success) {
      // Перенаправление на страницу успеха
      return NextResponse.redirect(new URL('/email-verified', request.url))
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 400 }
    )
  }
}


