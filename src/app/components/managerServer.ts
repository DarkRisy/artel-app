import { useCallback } from 'react';
import { useToast } from '../hooks/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Типы данных
type Product = {
  id: number;
  Name: string; // Изменил на camelCase
  Price: string; // Изменил на camelCase
  Image: string | null; // Изменил на camelCase
};

type ProductFormData = {
  name: string;
  price: string;
  image?: File;
};

/**
 * Получение списка товаров
 */
export const getProducts = async (): Promise<{ data: Product[] }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    const data = await res.json();
    return data
    // return {
    //   data: data.map((product: Product) => ({
    //     ...product,
    //     image: product.image || '/default-image.png', // Убедитесь, что у вас есть значение по умолчанию
    //   })),
    // };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Не удалось загрузить товары');
  }
};

/**
 * Создание нового товара
 */
export const createProduct = async (productData: ProductFormData): Promise<{ data: Product }> => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const res = await fetch(`${API_BASE_URL}/products/createProduct`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Не удалось создать товар');
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Не удалось создать товар');
  }
};

/**
 * Обновление существующего товара
 */
export const updateProduct = async (
  productId: number,
  productData: ProductFormData
): Promise<{ data: Product }> => {
  try {
    const formData = new FormData();
    formData.append('id', productId.toString());
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const res = await fetch(`${API_BASE_URL}/products/UpdateProduct`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Не удалось обновить товар');
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Не удалось обновить товар');
  }
};

/**
 * Удаление товара
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Не удалось удалить товар');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Не удалось удалить товар');
  }
};

// Хук для работы с товарами
// В вашем managerServer.ts
export const useProducts = () => {
  const { toast } = useToast();

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const response = await getProducts();
      return response.data;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    try {
      const response = await createProduct(productData);
      toast({
        title: 'Успех',
        description: 'Товар успешно добавлен',
      });
      return response.data;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Аналогично для editProduct и removeProduct
  const editProduct = useCallback(async (productId: number, productData: ProductFormData) => {
    try {
      const response = await updateProduct(productId, productData);
      toast({
        title: 'Успех',
        description: 'Товар успешно обновлен',
      });
      return response.data;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const removeProduct = useCallback(async (productData: ProductFormData) => {
    try {
      const response = await deleteProduct(productData);
      toast({
        title: 'Успех',
        description: 'Товар успешно обновлен',
      });
      return response.data;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
};