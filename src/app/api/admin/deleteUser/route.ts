import { RemoveUser } from "./remove"

export async function POST(request: Request) {
    const res = await request.json()
    await RemoveUser(res)
    return Response.json({ res })

}