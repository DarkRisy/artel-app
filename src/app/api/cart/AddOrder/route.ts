import { AddToOrder } from "./addOrder"


export async function POST(request: Request) {
    const res = await request.json()
    await AddToOrder(res)
    return Response.json({ res })
}