'use server'
import * as bcrypt from 'bcryptjs';
import { SignupFormSchema, FormState } from '@/app/api/lib/definitions'
import { createSession } from "@/app/api/lib/session";
import { redirect } from "next/navigation";
import { Order, Role, User, UserCart } from "../db";

export async function signup (state: FormState, formData: FormData, ) {

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
    await User.create({
        Name: name,
        Email: email,
        Password: hashedPassword,
        roleId: 1,
      })
      const data = await User.findOne({ where: { Email:email }})
      const role = await Role.findOne({ where:  { id:data.roleId }})
      await UserCart.create({
        id: data.id
      })
      await Order.create({
        id: data.id
      })
      await User.update(
        {
          CartId: data.id,
        },
        {
          where: {
            id: data.id,
          },
        }
      )
      await createSession(data.id, role.name)
      redirect('/user')
}
