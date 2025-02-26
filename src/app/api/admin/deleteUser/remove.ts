'use server'
import { User } from "../../db";




export async function RemoveUser(user: any) {
    User.destroy({where: {id: user.id},})
};
