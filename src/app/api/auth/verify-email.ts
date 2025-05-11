import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Найти пользователя по токену
    const user = await User.findOne({ where: { emailVerificationToken: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Обновить статус пользователя
    await user.update({
      emailVerified: true,
      emailVerificationToken: null
    });

    // Перенаправить на страницу успешного подтверждения
    res.redirect('/email-verified');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}