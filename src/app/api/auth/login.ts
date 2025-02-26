'use server'
import * as bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import { FormState, LoginFormSchema } from "../lib/definitions";
import { createSession } from "../lib/session";
import { Role, User } from "../db";

export async function login(state: FormState, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { email, password } = validatedFields.data

    const data = await User.findOne({ where: { Email: email } })
    const role = await Role.findOne({ where: { id: data.roleId } })

    bcrypt.compare(password, data.Password, async function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        if (result) {
            await createSession(data.id, role.name)
            
        } else {
            console.log("Password is incorrect!");
            // state?.errors?.password?: ;
        }
    });
    redirect('/user')

}



