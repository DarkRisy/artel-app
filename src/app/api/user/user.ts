import { User } from "../db";


export async function UpdateUserData(user: any) {
    User.update({
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone
    },{where: {id: user.id},})

}