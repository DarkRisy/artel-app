'use server'
import { NextResponse } from "next/server";
import { UserProduct } from "../db";
import { cookies } from "next/dist/server/request/cookies";
import { decrypt } from "../lib/session";
import { RemoveToCart } from "./remove_product";


export async function GET() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session) {
        const data = []
        return NextResponse.json({ data })
    } else {
        const products = await UserProduct.findAll({ where: { CartId: session?.userId, OrderId: null } })
        const data = products
        return NextResponse.json({ data })
    }
}
export async function POST(request: Request) {
    const res = await request.json()
    await RemoveToCart(res)
    return Response.json({ res })
}
