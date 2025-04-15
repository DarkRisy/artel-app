import { z } from 'zod'


export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Длина имени должна составлять не менее 2 символов.' })
        .trim(),
    email: z.string().email({ message: 'Пожалуйста, введите действительный адрес электронной почты.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Длина должна быть не менее 8 символов' })
        .regex(/[a-zA-Z]/, { message: 'Содержать хотя бы одну букву.' })
        .regex(/[0-9]/, { message: 'Содержать по крайней мере одну цифру' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Содержать по крайней мере один специальный символ.' })
        .trim(),
})

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Пожалуйста, введите действительный адрес электронной почты.' }).trim(),
    password: z
        .string()
        .trim(),
})

export type FormState =
    | {
        errors?: {
            name?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined
// export type SessionPayload = {
//     userId: any,
//     expiresAt: Date,
//     role: any,
// }
