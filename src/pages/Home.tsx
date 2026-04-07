import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';


const Home = () => {
  const { products, isLoading } = useProducts();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [perimeterSearch, setPerimeterSearch] = useState('');

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
  
  // Pegamos os 5 mais recentes
  const recentProducts = [...products]
    .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
    .slice(0, 5);

  // Busca de Perímetro
  const perimeterResults = useMemo(() => {
    if (!perimeterSearch.trim()) return [];
    
    // Busca registros que possuam o perimetro exato (ou contenham a string)
    const matches = products.filter(p => 
      p.perimeter && p.perimeter.trim() !== '' && p.perimeter.toUpperCase().includes(perimeterSearch.trim().toUpperCase())
    );
    
    return matches;
  }, [perimeterSearch, products]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-primary/10 flex items-center p-4 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-primary to-yellow-400 p-2 rounded-xl shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white">rocket_launch</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-slate-800 dark:text-primary">APOLLO</h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 bg-white dark:bg-primary/20 text-slate-700 dark:text-primary rounded-full shadow-md border border-slate-200 dark:border-primary/30 hover:scale-105 transition-transform"
          title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
        >
          <span className="material-symbols-outlined">{isDark ? "light_mode" : "dark_mode"}</span>
        </button>
      </header>

      <main className="flex-1 pb-24">
        {/* Painel Inicial */}
        <section className="p-4 sm:p-6 pb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Olá, Operador</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Buscando alta performance hoje?</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white dark:bg-primary/5 p-4 rounded-2xl border border-slate-200 dark:border-primary/10 flex flex-col items-center shadow-sm">
              <p className="text-xs text-slate-500 dark:text-primary/60 uppercase font-bold tracking-widest text-center">Total Salvos</p>
              <p className="text-4xl font-black mt-2 text-primary">{products.length}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Registros</p>
            </div>
            <Link to="/novo" className="bg-gradient-to-br from-primary to-yellow-500 p-4 rounded-2xl border border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1">
              <span className="material-symbols-outlined text-4xl text-white mb-1">add_circle</span>
              <p className="text-sm font-black text-white uppercase text-center mt-1 tracking-wider leading-tight">Novo<br/>Registro</p>
            </Link>
          </div>
        </section>

        {/* Busca por Perímetro */}
        <section className="px-4 sm:px-6 mt-6">
          <div className="bg-white dark:bg-primary/5 p-5 rounded-2xl border border-slate-200 dark:border-primary/10 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">search</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">Busca Rápida de Corte</h3>
            </div>
            
            <input 
              type="text" 
              placeholder="Digite o Perímetro (ex: 300)" 
              value={perimeterSearch}
              onChange={(e) => setPerimeterSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-primary/20 rounded-xl p-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
            />
            
            {perimeterSearch.trim() !== '' && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opções Encontradas:</p>
                {perimeterResults.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {perimeterResults.map(p => (
                      <Link key={p.id} to={`/produto/${p.id}`} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-primary/10 border border-slate-100 dark:border-primary/20 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[120px] sm:max-w-[180px]">{p.name}</span>
                          <span className="text-[10px] text-slate-500">Perímetro: {p.perimeter}</span>
                        </div>
                        <div className="flex px-3 py-1 bg-primary/20 rounded-md shrink-0">
                          <span className="text-xs font-bold text-primary">Corte: {p.cut || 'N/A'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                   <p className="text-xs py-2 text-red-500 font-semibold text-center bg-red-50 dark:bg-red-500/10 rounded-lg">Nenhum corte encontrado para este perímetro.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Mais Recentes */}
        <section className="px-4 sm:px-6 mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-primary/50">Mais Recentes</h3>
            <Link to="/produtos" className="text-primary text-xs font-bold uppercase hover:underline">Ver Todos</Link>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-6 bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/10 shadow-sm">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
              </div>
            ) : recentProducts.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">Nenhum registro ainda.</p>
            ) : (
              recentProducts.map(product => (
                <Link key={product.id} to={`/produto/${product.id}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="shrink-0 size-14 sm:size-16 bg-primary/10 rounded-xl overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {product.speed && <span className="mr-2 px-1.5 py-0.5 bg-slate-100 dark:bg-black/30 rounded">V: {product.speed}</span>}
                      {product.cut && <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-black/30 rounded">C: {product.cut}</span>}
                    </p>
                  </div>
                  <div className="size-8 rounded-full bg-slate-50 dark:bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <span className="material-symbols-outlined text-slate-400 dark:text-primary/70 group-hover:text-primary transition-colors text-sm">chevron_right</span>
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
