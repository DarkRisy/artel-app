'use client'
import Link from "next/link"
import { login } from "../api/auth/login"
import { useActionState } from 'react'

function Auth() {
    const [state, action, pending] = useActionState(login, undefined)
    return (
        <>
            <div className="pt-[146px]">
                <form className="flex justify-center items-center flex-col gap-[20px] text-white font-body"  action={action}>
                    <p className="font-bold mb-[28px] text-[32px]">Авторизация</p>
                    <input name="email" className="w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F] text-center placeholder:text-center" type="email" placeholder="Email"/>
                    {state?.errors?.email && <p>{state.errors.email}</p>}
                    <input name="password" className="w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F] text-center placeholder:text-center" type="password" placeholder="Password"/>
                    {state?.errors?.password && (
                        <div>
                            <p>Пароль должен соответствовать требованиям:</p>
                            <ul>
                                {state.errors.password.map((error) => (
                                    <li key={error}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {state?.message && <p>{state?.message}</p>}
                    <button disabled={pending} className="mt-[20px] w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F]" type="submit">Войти</button>
                    <Link href="/register"><p>Зарегистритоваться</p></Link>
                </form>
                
            </div>
        </>
    )
}

export default Auth