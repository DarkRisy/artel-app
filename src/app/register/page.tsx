'use client'
import { signup } from '@/app/api/auth/register'
import Link from 'next/link'
import { useActionState } from 'react'

function Register() {
    const [state, action, pending] = useActionState(signup, undefined)
    return (
        <>
            <div className="pt-[146px]">
                <form action={action} className="flex justify-center items-center flex-col gap-[20px] text-white"  >
                    <p className="font-bold mb-[28px] text-[32px]">Регистрация</p>
                    <input id='name' name='name' className="w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F] text-center placeholder:text-center" type="text" placeholder="Фамилия Имя Отчество" />
                    {state?.errors?.name && <p>{state.errors.name}</p>}
                    <input id='email' name='email' className="w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F] text-center placeholder:text-center" type="email" placeholder="Email"/>
                    {state?.errors?.email && <p>{state.errors.email}</p>}
                    <input id='password' name='password' className="w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F] text-center placeholder:text-center" type="password" placeholder="Password"/>
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
                    <button disabled={pending} className="mt-[20px] w-[274px] h-[40px] bg-[#2D3538] border-2 border-[#C34D3F]" type="submit">Зарегестрироваться</button>
                    <Link href="/auth"><p>Уже есть аккаунт</p></Link>
                </form>
                
            </div>
        </>
    )
}

export default Register