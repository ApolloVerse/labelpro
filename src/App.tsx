import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import List from './pages/List';
import Form from './pages/Form';
import Edit from './pages/Edit';
import Settings from './pages/Settings';

const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  return null;
};

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-primary/10 px-2 pb-6 pt-3 z-50 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="max-w-md mx-auto relative flex justify-between items-end">
        <div className="flex flex-1 justify-around">
          <Link to="/" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/' ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${path === '/' ? 'bg-primary/20' : ''}`}>
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: path === '/' ? "'FILL' 1" : "" }}>home</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Início</p>
          </Link>
          <Link to="/produtos" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/produtos' ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${path === '/produtos' ? 'bg-primary/20' : ''}`}>
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: path === '/produtos' ? "'FILL' 1" : "" }}>inventory</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Produtos</p>
          </Link>
        </div>

        {/* Central Floating Button */}
        <div className="relative -top-8 px-2 flex flex-col items-center justify-center shrink-0">
          <Link to="/novo" className="flex items-center justify-center size-16 rounded-full bg-primary text-black shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all outline outline-8 outline-background-light dark:outline-background-dark">
            <span className="material-symbols-outlined text-4xl font-black">add</span>
          </Link>
          <p className="text-[9px] font-bold uppercase tracking-widest mt-2 text-slate-400">Novo</p>
        </div>

        <div className="flex flex-1 justify-around">
          <Link to="/produtos" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/historico' ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl">
              <span className="material-symbols-outlined text-[26px]">history</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Histórico</p>
          </Link>
          <Link to="/configuracoes" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/configuracoes' ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${path === '/configuracoes' ? 'bg-primary/20' : ''}`}>
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: path === '/configuracoes' ? "'FILL' 1" : "" }}>settings</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Ajustes</p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/produtos" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <List />
          </motion.div>
        } />
        <Route path="/novo" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <Form />
          </motion.div>
        } />
        <Route path="/produto/:id" element={
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Edit />
          </motion.div>
        } />
        <Route path="/configuracoes" element={
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <Settings />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ProductProvider>
      <Router>
        <ScrollToTop />
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
          <AnimatedRoutes />
          <BottomNav />
        </div>
      </Router>
    </ProductProvider>
  );
};

export default App;
