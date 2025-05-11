'use client';
import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { useToast } from "../hooks/use-toast";
import { getData, isAuthenticated } from "./productServer";
import ServiceForm from "./forms/serviceForm";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { ServiceType } from "./forms/types";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOutsideClick?: boolean;
}

interface Product {
  id: string;
  Name: string;
  CategoryId: ServiceType;
  price: number;
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
      sessionStorage.setItem("products", JSON.stringify(response.data));
    } catch (error) {
      console.error("Не удалось загрузить продукцию компании", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить продукцию компании",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAuthError = useCallback(() => {
    toast({
      title: "Требуется авторизация",
      description: "Для оформления заказа необходимо войти в систему",
      variant: "destructive",
    });
    setIsModalOpen(false);
  }, [toast]);

  const checkAuthAndOpenModal = useCallback(async (product: Product) => {
    try {
      const auth = await isAuthenticated();
      if (!auth.data.userId) {
        handleAuthError();
        return;
      }
      setSelectedProduct(product);
      setIsModalOpen(true);
    } catch (error) {
      handleAuthError();
    }
  }, [handleAuthError]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container mt-[120px] mx-auto py-8 flex flex-col items-center min-h-screen">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-12 text-white"
      >
        Наши услуги
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full px-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard 
              product={product} 
              onOpenModal={checkAuthAndOpenModal} 
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <Modal onClose={handleCloseModal} size="lg">
            <ServiceForm 
              product={selectedProduct} 
              onClose={handleCloseModal} 
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="relative w-16 h-16">
      <motion.div
        className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-white/80"
    >
      Загружаем каталог...
    </motion.p>
  </div>
);

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 w-full">
        <Image
          src={`/images/${product.Image}`}
          alt={product.Name || "Изображение услуги"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{product.Name}</h3>
        
        <motion.button
          onClick={() => onOpenModal(product)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 bg-gradient-to-r from-[#C34D3F] to-[#A23D32] text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          Оформить заказ
        </motion.button>
      </div>
    </motion.div>
  );
};

const Modal: React.FC<ModalProps> = ({ 
  children, 
  onClose,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-auto">
      <div 
        className={`relative mx-auto my-8 ${sizeClasses[size]}  rounded-xl `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {children}
      </div>
    </div>
  );
};

export default Products;