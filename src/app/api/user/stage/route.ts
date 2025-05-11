'use server'
import { cookies } from "next/dist/server/request/cookies"
import { decrypt } from "../../lib/session"
import { ConstructionStage, Order, } from "../../db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cookie = (await cookies()).get('session')?.value;
        if (!cookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await decrypt(cookie);
        if (!session?.userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const ID = session.userId;
        const orders = await Order.findAll({ 
            where: { UserId: ID },
            raw: true  
        });

        const stages = await ConstructionStage.findAll({ raw: true });
        
        const ordersWithStages = orders.map((order: { id: number }) => ({
            ...order,
            stages: stages.filter((stage: { OrderId: number }) => stage.OrderId === order.id)
        }));

        return NextResponse.json({ ordersWithStages });
    } catch (error) {
        console.error('Error in GET /api/orders:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}