'use server'
import { User } from "../../db";

export async function AddToAdmin(userId: number, role: number) {
    User.update({roleId: role},{where: {id: userId},})
};
