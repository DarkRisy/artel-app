'use server'
import { cookies } from "next/headers";
import { User } from "../db";
import { decrypt } from "../lib/session";
import * as bcrypt from 'bcryptjs';


export async function UpdateUserData(user: any) {
    User.update({
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone
    }, { where: { id: user.id }, })

}
export async function ChangePassword({currentPassword, newPassword}) {
  try {
    const cookie = (await cookies()).get('session')?.value
    if (!cookie) {
      throw new Error('Нет сессионных данных')
    }
    const session = await decrypt(cookie)
    if (!session?.userId) {
      throw new Error('Некорректный сеанс')
    }
    const user = await User.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);
    if (!isPasswordValid) {
      return { success: false, message: 'Текущий пароль неверен' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ Password: hashedPassword });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Ошибка:', error.message)
      return { success: false, message: error.message }
    } else {
      console.error('Неизвестная ошибка')
      return { success: false, message: 'Произошла неизвестная ошибка' }
    }
  }
}