'use server'

import { NextResponse } from "next/server"
import { decrypt } from "../lib/session"
import { User } from "../db"
import { UpdateUserData } from "./user"
import { cookies } from "next/dist/server/request/cookies"


export async function GET() {
    try {
        const cookie = (await cookies()).get('session')?.value;
        
        if (!cookie) {
            return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
        }

        const session = await decrypt(cookie);
        
        if (!session?.userId) {
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
        }

        const user = await User.findOne({ where: { id: session.userId }, raw: true });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ data: user });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    const res = await request.json()
    await UpdateUserData(res)
    return Response.json({ res })
}