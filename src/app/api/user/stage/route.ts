'use server'

import { cookies } from "next/dist/server/request/cookies"
import { decrypt } from "../../lib/session"
import { ConstructionStage, UserProduct } from "../../db"
import { NextResponse } from "next/server"

export async function GET() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    const orders = await UserProduct.findAll({ where: { CartId: session?.userId, OrderId: session?.userId }, raw: true  })
    const stages = await ConstructionStage.findAll({raw: true })
    const ordersWithStages = orders.map((order: { id: number }) => ({
        ...order,
        stages: stages.filter((stage: { OrderId: number }) => stage.OrderId == order.id) // Отфильтровываем этапы по id заказа
    }));
    return NextResponse.json({ ordersWithStages })
}
