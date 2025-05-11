import { NextResponse } from "next/server";
import { UserProduct } from "../db";


export async function GET() {
    const products = await UserProduct.findAll({raw: true });
    const data = products
    return NextResponse.json({ data })
}
