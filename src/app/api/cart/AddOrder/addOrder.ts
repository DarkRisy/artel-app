import { UserProduct } from "../../db";


export async function AddToOrder(product: any) {
    UserProduct.update({ OrderId: product.CartId }, { where: { id: product.id }, })
};