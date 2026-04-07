import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';


const Home = () => {
  const { products, isLoading } = useProducts();
  const [, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  // Toggle Theme
  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);
  
  // Busca de Perímetro
  const [perimeterSearch, setPerimeterSearch] = useState('');
  const perimeterResults = useMemo(() => {
    if (!perimeterSearch.trim()) return [];
    
    // Busca registros que possuam o perimetro exato (ou contenham a string)
    const matches = products.filter(p => 
      p.perimeter && p.perimeter.trim() !== '' && p.perimeter.toUpperCase().includes(perimeterSearch.trim().toUpperCase())
    );
    
    return matches;
  }, [perimeterSearch, products]);

  // Pegamos os 10 mais recentes
  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
      .slice(0, 10);
  }, [products]);

  const getRelativeTime = (time: number) => {
    const diff = Math.floor((Date.now() - time) / 60000); // in minutes
    if (diff < 1) return 'Sincronizado agora';
    if (diff < 60) return `Atualizado há ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Concluído há ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Há ${days} dia${days > 1 ? 's' : ''}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl flex items-center p-6 justify-between border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-primary size-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[28px] text-black">rocket_launch</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">APOLLO</h1>
            <h2 className="text-[22px] leading-tight font-extrabold text-slate-800 dark:text-white mt-0.5">Olá, Operador</h2>
          </div>
        </div>
        <div className="relative cursor-pointer" onClick={toggleTheme}>
          <span className="material-symbols-outlined text-[28px] text-slate-700 dark:text-slate-300">notifications</span>
          <span className="absolute top-0 right-0.5 size-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Painel Inicial (Cards) */}
        <section className="p-6">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-primary/10 size-10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">database</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span className="text-[11px] font-bold">5.2%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Salvos</p>
                <p className="text-[32px] font-extrabold text-slate-800 dark:text-white leading-none">{products.length}</p>
              </div>
            </div>

            {/* Card 2 - Buscador de Perímetro */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 z-10">
                <div className="bg-primary/10 size-10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">search</span>
                </div>
                <div className="flex items-center text-primary">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">Buscador</span>
                </div>
              </div>
              <div className="z-10 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Perímetro</p>
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700 focus-within:border-primary/50 transition-all">
                  <input 
                    type="number"
                    placeholder="Ex: 300"
                    value={perimeterSearch}
                    onChange={(e) => setPerimeterSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                
                <div className="h-[46px] flex items-end">
                  {perimeterSearch.trim() !== '' && perimeterResults.length > 0 && (
                    <div className="w-full flex items-baseline justify-between bg-primary/10 px-3 py-2 rounded-xl border border-primary/20">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Corte:</span>
                      <span className="text-xl font-black text-primary leading-none">{perimeterResults[0].cut || 'N/A'}</span>
                    </div>
                  )}
                  {perimeterSearch.trim() !== '' && perimeterResults.length === 0 && (
                    <div className="w-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-xl h-[40px]">
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Não enc.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Mais Recentes */}
        <section className="px-6 mt-4 space-y-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[18px] font-bold text-slate-800 dark:text-white">Mais Recentes</h3>
            <Link to="/produtos" className="text-primary text-sm font-medium hover:brightness-110">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
              </div>
            ) : recentProducts.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">Nenhum registro ainda.</p>
            ) : (
              recentProducts.map(product => (
                <Link key={product.id} to={`/produto/${product.id}`} className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <div className="shrink-0 size-14 bg-[#f4fafa] dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-[28px]">qr_code_scanner</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-extrabold text-[13px] text-slate-900 dark:text-white truncate uppercase tracking-wide">{product.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {getRelativeTime(product.updatedAt || product.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 pr-1">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">chevron_right</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

      </main>
    </>
  );
};

export default Home;
