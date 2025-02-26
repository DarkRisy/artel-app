import { NextResponse } from "next/server";
import { User, UserProduct } from "../db";
import { revalidatePath } from "next/cache";
import { AddToAdmin } from "./AddRight/AddRight";


export async function GET() {
    const products = await User.findAll({raw: true });
    const data = products
    return NextResponse.json({ data })
}
