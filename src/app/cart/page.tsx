'use client'
import { Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useLayoutEffect, useState } from "react";


export async function getData() {
  const res = await fetch('http://localhost:3000/api/cart');
  return res.json();
}
export async function DeleteItem(item: any) {
  const res = await fetch('http://localhost:3000/api/cart', {
    method: 'POST',
    body: JSON.stringify(item)
  });
  return res.json()
}
export async function CreateOrder(item: any) {
  const res = await fetch('http://localhost:3000/api/cart/AddOrder', {
    method: 'POST',
    body: JSON.stringify(item)
  });
  return res.json()
}



const newData = await getData()


export default function Cart() {
  let [cartItems, setCartItems] = useState([])
  useLayoutEffect(() => {
    setCartItems(newData.data)
  }, []);
  const total = cartItems.reduce((sum: number, item: any) => sum + item.Price * 1, 0);
  const { toast } = useToast();
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item: any) => item.id != id));
    toast({
      title: "Товар удален",
      description: "Товар успешно удален из корзины",
    });
  };
  const checkout = (item: any) => {
    CreateOrder(item)
    removeItem(item.id)
  };

  return (
    <div className="container mx-auto py-8 pt-[150]">
      <h2 className="text-3xl font-bold mb-8">Корзина</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Корзина пуста</p>
      ) : (
        <div suppressHydrationWarning className="space-y-6">
          {
            cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src={item.Image} alt={item.Name} className="w-20 h-20 object-cover rounded" />
                  <div suppressHydrationWarning>
                    <h3 className="font-bold">{item.Name}</h3>
                    <p suppressHydrationWarning className="text-gray-600">{item.Price} ₽</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">

                  <button onClick={() => { DeleteItem(item), removeItem(item.id) }}><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => { checkout(item) }} >Оформить заказ</button>
                </div>
              </div>

            ))}
          <div className="flex justify-between items-center border-t pt-6">
            <div className="text-xl font-bold">
              Итого: {total} ₽
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

