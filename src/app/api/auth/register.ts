'use server'
import * as bcrypt from 'bcryptjs';
import { SignupFormSchema, FormState } from '@/app/api/lib/definitions'
import { createSession } from "@/app/api/lib/session";
import { redirect } from "next/navigation";
import { Order, Role, User } from "../db";
import { generateVerificationToken } from '../utils/tokenGenerator';
import { sendVerificationEmail } from '../utils/emailSender';

export async function signup(state: FormState, formData: FormData,) {

    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { name, email, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)
    const CheckEmail = await User.findOne({ where: { Email: email } })
    if (CheckEmail) {
        return {
            message: "Данный Email уже зарегистрирован!"
        }
    }
    const verificationToken = generateVerificationToken();
    await User.create({
        Name: name,
        Email: email,
        emailVerificationToken: verificationToken,
        emailVerified: false,
        Password: hashedPassword,
        roleId: 1,
    })
    await sendVerificationEmail(email, verificationToken);
    const data = await User.findOne({ where: { Email: email } })
    const role = await Role.findOne({ where: { id: data.roleId } })

    await createSession(data.id, role.name, data.emailVerified)
    redirect('/user')
}
