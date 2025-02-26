import { NextResponse } from "next/server";
import { UserProduct } from "../db";
import { cookies } from "next/dist/server/request/cookies";
import { decrypt } from "../lib/session";



export async function GET() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session) {
        const data = []
        return NextResponse.json({ data })
    } else {
        const data = session
        return NextResponse.json({ data })
    }
}