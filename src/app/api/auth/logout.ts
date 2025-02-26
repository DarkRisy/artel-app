'use server'
import { deleteSession } from "@/app/api/lib/session"
import { redirect } from "next/navigation"

export async function logout() {
    deleteSession()
    redirect('/auth')
  }