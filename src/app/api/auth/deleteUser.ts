'use server'
import { deleteSession } from "@/app/api/lib/session"
import { redirect } from "next/navigation"

export async function deleteAccount() {
    deleteSession()
    redirect('/register')
  }