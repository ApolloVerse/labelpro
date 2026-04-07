import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';

const List = () => {
  const { products, isLoading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteProduct(id);
      setDeletingId(null);
    }, 250);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <button onClick={() => navigate('/')} className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Lista de Produtos</h2>
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => navigate('/novo')} className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-primary">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 max-w-2xl mx-auto w-full">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-primary flex bg-white dark:bg-primary/10 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary border-none bg-white dark:bg-primary/10 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Pesquisar registros salvos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-primary/5 rounded-2xl border border-primary/10 gap-4 mt-10">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">sync</span>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Buscando na Nuvem...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-slate-500">Nenhum produto encontrado.</div>
        ) : (
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={deletingId === product.id ? { opacity: 0, x: 60 } : { opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.25, delay: deletingId === product.id ? 0 : index * 0.05 }}
                className="relative group bg-white dark:bg-primary/5 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors hover:shadow-md"
              >
                {/* Área clicável para navegação */}
                <div
                  className="flex items-center gap-3 p-3 pr-14 cursor-pointer"
                  onClick={() => navigate(`/produto/${product.id}`)}
                >
                  <div className="shrink-0 size-12 bg-primary/20 rounded-lg overflow-hidden flex items-center justify-center border border-primary/10">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary">inventory_2</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors uppercase tracking-tight">{product.name}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5 uppercase font-medium">
                      {product.speed && <span className="mr-2">VEL: {product.speed}</span>}
                      {product.cut && <span className="mr-2">CORTE: {product.cut}</span>}
                      {product.chagrim && <span>CH: {product.chagrim}</span>}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-sm shrink-0">chevron_right</span>
                </div>

                {/* Botão de exclusão compacto */}
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="Excluir"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </>
  );
};

export default List;
