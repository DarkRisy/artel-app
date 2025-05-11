'use server'
import { deleteSession } from "@/app/api/lib/session"
import { redirect } from "next/dist/client/components/redirect"


export async function logout() {
    await deleteSession()
    redirect('/auth')
  }