'use client';
import { Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useEffect, useState } from "react";
import { getData, deleteItem, createOrder, CartItem } from './cartServer'; // Импортируйте ваши API функции

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getData();
      setCartItems(newData.data);
    };
    fetchData();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.Price * 1, 0);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Товар удален",
      description: "Товар успешно удален из корзины",
    });
  };

  const addToOrderItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Заказ оформлен",
      description: "Вы успешно оформили заказ!",
    });
  };

  const checkout = async (item: CartItem) => {
    await createOrder(item);
    addToOrderItem(item.id);
  };

  const handleDelete = async (item: CartItem) => {
    await deleteItem(item);
    removeItem(item.id);
  };

  return (
    <div className="container mx-auto py-8 pt-[150]">
      <h2 className="text-3xl font-bold mb-8">Корзина</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Корзина пуста</p>
      ) : (
        <div suppressHydrationWarning className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.Image} alt={item.Name} className="w-20 h-20 object-cover rounded" />
                <div suppressHydrationWarning>
                  <h3 className="font-bold">{item.Name}</h3>
                  <p suppressHydrationWarning className="text-gray-600">{item.Price} ₽</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleDelete(item)}>
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => checkout(item)}>Оформить заказ</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center border-t pt-6">
            <div className="text-xl font-bold">Итого: {total} ₽</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;