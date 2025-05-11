import { AddToAdmin } from "./AddRight"

export async function POST(request: Request) {
    const res = await request.json()
    await AddToAdmin(res.userId, res.role)
    return Response.json({ res })

}