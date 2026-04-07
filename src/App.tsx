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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-primary/10 px-4 pb-4 pt-2 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="max-w-md mx-auto flex gap-2">
        <Link to="/" className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/' ? 'text-primary scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: path === '/' ? "'FILL' 1" : "" }}>home</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">Início</p>
        </Link>
        <Link to="/produtos" className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/produtos' ? 'text-primary scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: path === '/produtos' ? "'FILL' 1" : "" }}>inventory_2</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">Produtos</p>
        </Link>
        <Link to="/novo" className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/novo' ? 'text-primary scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: path === '/novo' ? "'FILL' 1" : "" }}>add_circle</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">Novo</p>
        </Link>
        <Link to="/configuracoes" className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${path === '/configuracoes' ? 'text-primary scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: path === '/configuracoes' ? "'FILL' 1" : "" }}>settings</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">Ajustes</p>
        </Link>
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
