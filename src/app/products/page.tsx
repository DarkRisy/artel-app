'use client'
import { useToast } from "../hooks/use-toast";
import React from "react";

async function isAuthenticated() {
  const res = await fetch('http://localhost:3000/api/isAuthenticated');
  return res.json();
}
async function getData() {
  const res = await fetch('http://localhost:3000/api/products');
  return res.json();
}
async function PostData(product: any) {

  const res = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: JSON.stringify(product)
  });
  return (
    res.json()
  )
}

const data = await getData();

export default function Products() {
  const { toast } = useToast();

  function trueItem(name: string) {
    toast({
      title: "Добавлено в корзину",
      description: `${name} добавлен в корзину`,
    })
  }
  function falseItem(name: string) {
    toast({
      title: "Вы не авторизованы!",
      description: `Для добавления товара в корзину необходима авторизация!`,
    })
  }
  async function Provide(product: any) {
    const auth = await isAuthenticated();
    const user = auth.data;

    if (!user.userId) {
      falseItem(product.Name)
    } else {
      PostData(product)
      trueItem(product.Name)
    }
  }
  const products = data.data
  return (
    <>
      <div className="container mx-auto py-8 flex flex-col items-center pt-[150]">
        <h2 className="text-3xl font-bold mb-8">Каталог товаров</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            products.map((product: any) => (
              <div key={product.id} className="border-[#C34D3F] border-2 border-solid p-4 shadow-md">
                <img
                  src={product.Image}
                  alt={product.Name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{product.Name}</h3>
                <p className="text-gray-400 mb-4">{product.Description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{product.Price} ₽</span>
                  <button onClick={() => { Provide(product) }}>В корзину</button>
                </div>
              </div>)
            )}
        </div>
      </div>
    </>

  );
};

