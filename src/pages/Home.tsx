import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';


const Home = () => {
  const { products, isLoading } = useProducts();
  
  // Pegamos os 5 mais recentes
  const recentProducts = [...products]
    .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 flex items-center p-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-primary">APOLLO</h1>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Painel Inicial */}
        <section className="p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Olá, Operador</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white dark:bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-col items-center">
              <p className="text-xs text-slate-500 dark:text-primary/60 uppercase font-bold tracking-widest text-center">Total Salvos</p>
              <p className="text-3xl font-extrabold mt-2 text-primary">{products.length}</p>
              <p className="text-[10px] text-slate-400 mt-1">Registros</p>
            </div>
            <Link to="/novo" className="bg-primary p-4 rounded-xl border border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-3xl text-background-dark mb-1">add_circle</span>
              <p className="text-sm font-bold text-background-dark uppercase text-center mt-1">Novo<br/>Registro</p>
            </Link>
          </div>
        </section>

        {/* Mais Recentes */}
        <section className="px-4 sm:px-6 mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-primary/50">Mais Recentes</h3>
            <Link to="/produtos" className="text-primary text-xs font-bold uppercase hover:underline">Ver Todos</Link>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-6 bg-white dark:bg-primary/5 rounded-xl border border-primary/10">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
              </div>
            ) : recentProducts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum registro ainda.</p>
            ) : (
              recentProducts.map(product => (
                <Link key={product.id} to={`/produto/${product.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="shrink-0 size-12 bg-primary/20 rounded-lg overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary">inventory_2</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {product.speed && <span className="mr-2">Vel: {product.speed}</span>}
                      {product.cut && <span>Corte: {product.cut}</span>}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-sm shrink-0">chevron_right</span>
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
