import { AddToAdmin } from "./AddRight"

export async function POST(request: Request) {
    const res = await request.json()
    await AddToAdmin(res)
    return Response.json({ res })

}