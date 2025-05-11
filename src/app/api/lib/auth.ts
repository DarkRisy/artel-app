import { User } from "../db";

export async function verifyEmailToken(token: string) {
  // Найти пользователя по токену в базе данных
  const user = await User.findOne({ where: { emailVerificationToken: token } });

  if (!user) {
    return { success: false, message: 'Invalid token' }
  }

  // Обновить статус пользователя
    await user.update({
      emailVerified: true,
      emailVerificationToken: null
    });

  return { success: true, message: 'Email verified successfully' }
}