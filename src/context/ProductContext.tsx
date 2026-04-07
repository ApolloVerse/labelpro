import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  importProducts: (products: Product[]) => Promise<void>;
  clearProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('factory-app-products-v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Set isLoading locally to true only if we have NO products cached
  const [isLoading, setIsLoading] = useState(() => {
    try {
      const saved = localStorage.getItem('factory-app-products-v2');
      return saved ? JSON.parse(saved).length === 0 : true;
    } catch {
      return true;
    }
  });

  // Fetch products from Supabase on load and subscribe to realtime changes (optimized)
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        // Optimized query: Select only the records we will display immediately
        // Note: For apps with many records, pagination or selecting only needed columns 
        // would be better, but the user wants it to work like before, just faster.
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('updatedAt', { ascending: false })
          .limit(15); // Initial fast load of only the latest 15 to prevent freezing

        if (error) {
          console.error('Error fetching products from Supabase:', error);
        } else if (data && isMounted) {
          setProducts(data as Product[]);
          localStorage.setItem('factory-app-products-v2', JSON.stringify(data));
          
          // Optionally fetch the rest in background if there's more
          if (data.length === 15) {
            const { data: allData } = await supabase
              .from('products')
              .select('*')
              .order('updatedAt', { ascending: false });
            
            if (allData && isMounted) {
              setProducts(allData as Product[]);
              localStorage.setItem('factory-app-products-v2', JSON.stringify(allData));
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching products:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Realtime event received!', payload);
          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Product;
            setProducts((prev) => {
              // Verifica se já existe para evitar duplicatas em atualizações otimistas locais
              if (prev.some(p => p.id === newDoc.id)) return prev;
              return [newDoc, ...prev].sort((a, b) => b.updatedAt - a.updatedAt);
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedDoc = payload.new as Product;
            setProducts((prev) => prev.map((p) => (p.id === updatedDoc.id ? updatedDoc : p)));
          } else if (payload.eventType === 'DELETE') {
            const deletedDoc = payload.old;
            setProducts((prev) => prev.filter((p) => p.id !== deletedDoc.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(), // Usando UUID para compatibilidade com a string id no Supabase
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Atualiza cache local otimisticamente
    setProducts(prev => [newProduct, ...prev]);

    // Salva no Supabase
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      console.error('Error adding product to Supabase:', error);
      // Reverter alteração otimista se der erro?
      alert('Erro ao salvar produto na nuvem: ' + error.message);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const nextUpdatedAt = Date.now();
    // Atualiza cache local otimisticamente
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: nextUpdatedAt } : p));

    // Atualiza no Supabase
    const { error } = await supabase.from('products').update({ ...updates, updatedAt: nextUpdatedAt }).eq('id', id);
    if (error) {
      console.error('Error updating product in Supabase:', error);
      alert('Erro ao atualizar produto na nuvem: ' + error.message);
    }
  };

  const deleteProduct = async (id: string) => {
    // Atualiza cache local otimisticamente
    setProducts(prev => prev.filter(p => p.id !== id));

    // Deleta no Supabase
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      alert('Erro ao excluir produto na nuvem: ' + error.message);
    }
  };

  const importProducts = async (newProducts: Product[]) => {
    setIsLoading(true);
    if(newProducts.length > 0) {
      const validProducts = newProducts.map(p => ({
        ...p,
        id: p.id || crypto.randomUUID(),
        createdAt: p.createdAt || Date.now(),
        updatedAt: p.updatedAt || Date.now()
      }));

      // Updates local state immediately for fast feedback
      setProducts(prev => {
        const combined = [...validProducts, ...prev.filter(p => !validProducts.find(v => v.id === p.id))];
        return combined.sort((a, b) => b.updatedAt - a.updatedAt);
      });

      const { error } = await supabase.from('products').upsert(validProducts);
      
      if(error) {
        console.error('Error importing products to Supabase:', error);
        alert('Erro ao importar produtos: ' + error.message);
      }
    }
    setIsLoading(false);
  };

  const clearProducts = async () => {
    // Para SQLite ou Postgres com Supabase, deletar tudo requer não passar filtros ou passar um filtro válido
    setProducts([]);
    
    // O id no DB é UUID, então '.neq("id", "0")' trava por type error. Filtrar por 'name' (texto) resolve essa limitação de API:
    const { error } = await supabase.from('products').delete().neq('name', 'deletar_tudo_workaround_404_not_found');
    
    if (error) {
      console.error('Error clearing products:', error);
      alert('Erro ao tentar limpar o banco na nuvem: ' + error.message);
    }
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct, importProducts, clearProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
