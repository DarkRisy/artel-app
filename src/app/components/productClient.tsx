'use client';
import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "../hooks/use-toast";
import { getData, isAuthenticated, postData } from "./productServer";

interface Product {
  id: string;
  Name: string;
  Description: any;
  Price: number;
  Image: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getData();
      setProducts(response.data);
    } catch (error) {
      handleErrors("Не удалось загрузить товары", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleErrors = (message: string, error: unknown) => {
    console.error(message, error);
    toast({
      title: "Ошибка",
      description: message,
      variant: "destructive",
    });
  };

  useEffect(() => {
    const cache = sessionStorage.getItem("products");
    if (cache) {
      setProducts(JSON.parse(cache));
      setIsLoading(false);
    } else {
      fetchProducts();
    }
  }, [fetchProducts]);

  return { products, isLoading, fetchProducts };
};

const Products: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { toast } = useToast();
  const handleAddToCart = useDebounceAsync(async (product: Product) => {
    try {
      const auth = await isAuthenticated();

      if (!auth.data.userId) {
        return showAuthError();
      }

      await postData(product);
      showToastSuccess(`${product.Name} успешно добавлен в корзину`);
    } catch (error) {
      showError("Не удалось добавить товар в корзину", error);
    }
  }, 300);

  const showAuthError = () => {
    toast({
      title: "Требуется авторизация",
      description: "Для добавления товара в корзину войдите в систему",
      variant: "destructive",
    });
  };

  const showError = (message: string, error: unknown) => {
    console.error(message, error);
    toast({
      title: "Ошибка",
      description: message,
      variant: "destructive",
    });
  };

  const showToastSuccess = (description: string) => {
    toast({
      title: "Успех",
      description,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center pt-[150]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center pt-[150]">
      <h2 className="text-3xl font-bold mb-8">Каталог</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin border-4 border-t-4 border-red-500 rounded-full w-6 h-6"></div>
    <span>Загрузка товаров...</span>
  </div>
);

const useDebounceAsync = (func: (...args: any[]) => Promise<void>, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [description, setDescription] = useState(product.Description);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value); // Изменение состояния при вводе
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, Description: description }); // Добавляем товар в корзину с измененным описанием
  };

  return (
    <div className="p-4 border-2 border-[#C34D3F] shadow-md rounded-lg transition-transform transform hover:scale-105 relative">
      <img
        src={`/images/${product.Image}`}
        alt={product.Name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{product.Name}</h3>
      
      <div className="mt-4">
      <textarea
          value={description || ""}
          placeholder="Добавьте здесь необходимые параметры перед заказом. Например: длина, ширина, высота..."
          onChange={handleDescriptionChange}
          className="border text-[#C34D3F] bg-[#2D3538] border-gray-300 rounded p-2 mb-2 w-full"
          style={{ height: '100px',width: '310px' , resize: 'none' }}
        />
      </div>
      
      {/* <p className="text-[#C34D3F] mb-4">{description}</p> */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">от {product.Price} ₽</span>
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-[#C34D3F] text-white px-4 py-2 rounded hover:bg-[#A23D32] transition-colors duration-200"
        >
          В корзину
        </button>
      </div>
    </div>
  );
};





export default Products;
