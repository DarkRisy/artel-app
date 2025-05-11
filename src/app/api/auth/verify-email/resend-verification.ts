'use server'

import { generateVerificationToken } from '../../utils/tokenGenerator';
import { sendVerificationEmail } from '../../utils/emailSender';
import { decrypt } from '../../lib/session';
import { cookies } from 'next/headers';
import { User } from '../../db';

export async function resendVerification() {
  const session = await decrypt((await cookies()).get('session')?.value)
  const user = await User.findOne({ where: { id: session?.userId } });
  const newToken = generateVerificationToken();
  await user.update({ emailVerificationToken: newToken });
  await sendVerificationEmail(user.Email, newToken);
}
