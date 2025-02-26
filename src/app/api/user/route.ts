'use server'

import { NextResponse } from "next/server"
import { decrypt } from "../lib/session"
import { User } from "../db"
import { UpdateUserData } from "./user"
import { cookies } from "next/dist/server/request/cookies"



export async function GET() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    const ID = session?.userId
    const user = await User.findOne({ where: { id: ID }, raw: true })
    const data = user
    return NextResponse.json({ data })
}


export async function POST(request: Request) {
    const res = await request.json()
    await UpdateUserData(res)
    return Response.json({ res })
}