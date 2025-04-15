// 'use server'
// import * as bcrypt from 'bcryptjs';
// import { redirect } from "next/navigation";
// import { FormState, LoginFormSchema } from "../lib/definitions";
// import { createSession } from "../lib/session";
// import { Role, User } from "../db";

// export async function login(state: FormState, formData: FormData) {
//     const validatedFields = LoginFormSchema.safeParse({
//         email: formData.get('email'),
//         password: formData.get('password'),
//     })

//     if (!validatedFields.success) {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//         }
//     }
//     const { email, password } = validatedFields.data

//     const data = await User.findOne({ where: { Email: email } })

//     if (!data) {
//         return{ message: "Неверный email или пароль!"}
//     }
//     const role = await Role.findOne({ where: { id: data.roleId } })
//     bcrypt.compare(password, data.Password, async function (err, result) {
//         if (err) {
//             return{ message: "Неверный email или пароль!"}
//         }
//         if (result) {
//             await createSession(data.id, role.name)

//         }
//     });
//     if( role.name == "Администратор"){
//         redirect('/admin')
//     }
//     else{
//         redirect('/user')
//     }


// }

'use server'
import * as bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import { FormState, LoginFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";
import { Role, User } from "../db";

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
        await createSession(user.id, role.name);
        
        // Редирект в зависимости от роли
        // if (role.name == "Администратор") {
        //     return { redirectUrl: '/admin' };
        // } else {
        //     return { redirectUrl: '/user' };
        // }

    } catch (error) {
        console.error('Ошибка при входе:', error);
        return {
            message: 'Неверный email или пароль!',
            errors: {}
        };
    }
    redirect('/user');
    return { errors: {}, message: '' };
}

