'use server'
import { User } from "../../db";

export async function AddToAdmin(user: any) {
    User.update({roleId: 2},{where: {id: user.id},})
};
