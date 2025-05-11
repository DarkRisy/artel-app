'use server'
import * as bcrypt from 'bcryptjs';
import { FormState, LoginFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";
import { Role, User } from "../db";
import { redirect } from 'next/dist/client/components/redirect';

export async function login(state: FormState, formData: FormData) {
    // Валидация формы
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: '',
        };
    }
    const { email, password } = validatedFields.data;
    try {
        // Поиск пользователя
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return {
                message: 'Неверный email или пароль!',
                errors: {}
            };
        }
        const role = await Role.findOne({ where: { id: user.roleId } })
        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return {
                message: 'Неверный email или пароль!',
                errors: {}
            };
        }
        // Создание сессии
        await createSession(user.id, role.name, user.emailVerified );

    } catch (error) {
        console.error('Ошибка при входе:', error);
        return {
            message: 'Неверный email или пароль!',
            errors: {}
        };
    }
    redirect('/user')
    return { errors: {}, message: '', };
}

