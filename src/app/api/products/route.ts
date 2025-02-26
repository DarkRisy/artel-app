import { NextResponse } from "next/server";
import { UserProduct } from "../db";
import { addToCart } from "./products";
import { revalidatePath } from "next/cache";


export async function GET() {
    const products = await UserProduct.findAll({where:{CartId: null}, raw: true });
    const data = products
    return NextResponse.json({ data })
}
export async function POST(request: Request) {
    const res = await request.json()
    await addToCart(res)
    return Response.json({ res })

}
