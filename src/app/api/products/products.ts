'use server'
import { cookies } from "next/dist/server/request/cookies";
import { UserProduct } from "../db";
import { decrypt } from "../lib/session";
import { revalidatePath } from "next/cache";



export async function addToCart(product: any) {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    await UserProduct.create({
        Name: product.Name,
        Description: product.Description,
        Price: product.Price,
        Image: product.Image,
        CartId: session?.userId
    })
};


