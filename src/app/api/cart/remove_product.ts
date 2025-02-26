'use server'
import { cookies } from "next/dist/server/request/cookies";
import { UserProduct } from "../db";
import { decrypt } from "../lib/session";



export async function RemoveToCart(item: any) {
    UserProduct.destroy({where: {id: item.id},})
};
