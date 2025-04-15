'use client';
import { v4 as uuidv4 } from 'uuid';
import React, { FormEvent, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useToast } from '../hooks/use-toast';
import { useProducts } from './managerServer'; // Импортируем хук useProducts

type Product = {
  id: number;
  Name: string;
  Price: string;
  Image?: string;
};

type ProductFormData = {
  name: string;
  price: string;
  image?: File;
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-[#C34D3F] hover:bg-[#A93F32] text-white',
    outline: 'border-2 border-[#C34D3F] text-white hover:bg-[#434e54]',
    danger: 'bg-[#DC3545] hover:bg-[#C82333] text-white',
  }[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseClasses} ${variantClasses} ${className}`}>
      {loading ? <span className="animate-spin"> {/* Add your spinner here */} </span> : null}
      {children}
    </button>
  );
};

export default function ManagerDashboard() {
  const { fetchProducts, addProduct, editProduct, removeProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchProducts();

        // Проверяем, является ли response массивом или содержит массив.
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (response.data && Array.isArray(response.data)) { 
          // Если ответ - объект, в котором массив находится в поле data
          setProducts(response.data);
        } else {
          throw new Error('Неожиданный формат ответа');
        }
      } catch (error) {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить список товаров',
          variant: 'destructive',
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts, toast]); // Добавлены зависимости для корректной работы

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string | null;
    const price = formData.get('price') as string | null;
    const image = formData.get('image') as File | null;
  
    if (!name || !price) {
      toast({ title: 'Ошибка', description: 'Имя и цена обязательны!', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
  
    const productData: ProductFormData = {
      name,
      price,
      image,
    };
  
    try {
      if (editingProduct) {
        const product = await editProduct(editingProduct.id, productData);
        if (product && product.id) {
          console.log('Текущий список продуктов до обновления:', products);
          setProducts(prev => prev.map(p => (p.id === product.id ? { ...p, ...product } : p)));
          console.log('Текущий список продуктов после обновления:', products);
          toast({ title: 'Товар обновлен', description: 'Операция успешна' });
        } else {
          throw new Error("Не удалось обновить продукт");
        }
      } else {
        const product = await addProduct(productData);
        const newProductId = products.length + 1; // Нужно чтобы ID не пересекались с существующими
        setProducts(prev => [...prev, { ...product, id: newProductId }]);
        toast({ title: 'Товар добавлен', description: 'Операция успешна' });
      }
    } catch (error) {
      console.error('Ошибка при добавлении/обновлении продукта:', error);
      toast({ title: 'Ошибка', description: 'Не удалось выполнить операцию', variant: 'destructive' });
    } finally {
      setEditingProduct(null);
      setShowForm(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Вы уверены?')) return;
    try {
      await removeProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: 'Товар удален', description: 'Операция успешна' });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось удалить товар', variant: 'destructive' });
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C34D3F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <h1 className="text-3xl mt-[100px] font-bold text-white">Управление товарами</h1>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">Добавить товар</Button>
          </div>
          {showForm && (
            <div className="border border-[#C34D3F] bg-[#2D3538] rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {editingProduct ? 'Редактирование товара' : 'Добавление нового товара'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <label htmlFor="name" className="block text-sm font-medium text-white">Название товара *</label>
                    <input id="name" name="name" defaultValue={editingProduct?.Name || ''} required disabled={isSubmitting} className="w-full px-4 py-2 border border-[#C34D3F] bg-[#2D3538] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent" />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="price" className="block text-sm font-medium text-white">Цена (руб) *</label>
                    <input id="price" name="price" type="number" min="0" step="0.01" defaultValue={editingProduct?.Price || ''} required disabled={isSubmitting} className="w-full px-4 py-2 border border-[#C34D3F] bg-[#2D3538] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent" />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="image" className="block text-sm font-medium text-white">Изображение товара {!editingProduct && '*'}</label>
                    <input id="image" name="image" type="file" accept="image/*" disabled={isSubmitting} className="w-full px-4 py-2 border border-[#C34D3F] bg-[#2D3538] rounded-lg focus:ring-2 focus:ring-[#C34D3F] focus:border-transparent" />
                    {editingProduct?.Image ? (
                      <Image
                        src={`/images/${editingProduct.Image}`}
                        alt={editingProduct.Name || 'Изображение товара'}
                        width={150}
                        height={150}
                        className="rounded-lg border border-[#C34D3F]"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700">Нет изображения</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => { setShowForm(false); setEditingProduct(null); }} disabled={isSubmitting}>Отмена</Button>
                  <Button type="submit" loading={isSubmitting}>{editingProduct ? 'Сохранить изменения' : 'Добавить товар'}</Button>
                </div>
              </form>
            </div>
          )}
          {/* Список товаров */}
          <div className="border border-[#C34D3F] rounded-xl shadow-sm overflow-hidden">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-white mb-2">Нет товаров</h3>
                <p className="text-white">Начните добавлять товары, чтобы они отобразились здесь</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-[#C34D3F]">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white">Изображение</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white">Название</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white">Цена</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C34D3F]">
                  {products.map(product => (
                    <tr key={product.id} product={product}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Image
                          src={product.Image ? `/images/${product.Image}` : '/images/logo.svg'}
                          alt={product.Name || "Изображение товара"}
                          width={100}
                          height={100}
                          className="rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{product.Name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0
                          }).format(Number(product.Price))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => startEditing(product)} className="text-xs">
                            Редактировать
                          </Button>
                          <Button variant="danger" onClick={() => handleDelete(product.id)} className="text-xs">
                            Удалить
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}