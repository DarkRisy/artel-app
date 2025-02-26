'use server'

import { cookies } from "next/dist/server/request/cookies"
import { decrypt } from "../../lib/session"
import { UserProduct } from "../../db"
import { NextResponse } from "next/server"

export async function GET() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    const user = await UserProduct.findAll({ where: { CartId: session?.userId, OrderId: session?.userId } })
    const data = user
    return NextResponse.json({ data })
}