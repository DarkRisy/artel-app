import { NextResponse } from "next/server";
import { User } from "../db";



export async function GET() {
    const products = await User.findAll({raw: true });
    const data = products
    return NextResponse.json({ data })
}
