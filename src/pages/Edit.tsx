import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../types';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct } = useProducts();
  
  const [formData, setFormData] = useState<Partial<Product> | null>(null);
  const [newObservation, setNewObservation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddObservation = () => {
    if (newObservation.trim() && formData) {
      setFormData(prev => prev ? ({
        ...prev,
        observations: [...(prev.observations || []), newObservation.trim().toUpperCase()]
      }) : prev);
      setNewObservation('');
    }
  };

  const handleRemoveObservation = (index: number) => {
    setFormData(prev => prev ? ({
      ...prev,
      observations: (prev.observations || []).filter((_, i) => i !== index)
    }) : prev);
  };

  useEffect(() => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData(product);
    }
  }, [id, products]);

  if (!formData) return <div className="p-10 text-center">Carregando produto...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Nome do Produto é obrigatório.");
      return;
    }
    
    if (formData && id) {
      setIsSaving(true);
      // Simula um delay para a animação
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await updateProduct(id, formData);
      
      setIsSaving(false);
      setIsSuccess(true);
      
      // Mostra o feedback de sucesso antes de navegar
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Força uppercase em todos os campos de texto
    const finalValue = value.toUpperCase();
    setFormData(prev => prev ? { ...prev, [name]: finalValue } : prev);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { compressImage } = await import('../lib/imageUtils');
        const compressedBase64 = await compressImage(file);
        setFormData(prev => prev ? ({ ...prev, image: compressedBase64 }) : prev);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Erro ao processar imagem. Tente novamente.');
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => prev ? ({ ...prev, image: '' }) : prev);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <Link to="/produtos" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Editar Rótulo</h2>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-24">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produto *</label>
            <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Foto do Produto</label>
            <div className="space-y-3">
              {formData.image ? (
                <div className="relative size-40 mx-auto bg-primary/10 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tirar Foto</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-primary text-3xl">image</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Galeria</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Velocidade</label>
            <input type="text" name="speed" value={formData.speed || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Repetição</label>
            <input type="text" name="repetition" value={formData.repetition || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chagrim (Sim ou Não)</label>
            <select name="chagrim" value={formData.chagrim || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold">
              <option value="">Selecione...</option>
              <option value="SIM">SIM</option>
              <option value="NÃO">NÃO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Papel (Metalizado ou Couché)</label>
            <select name="paperType" value={formData.paperType || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold">
              <option value="">Selecione...</option>
              <option value="METALIZADO">METALIZADO</option>
              <option value="COUCHÊ">COUCHÊ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Perímetro</label>
            <input type="text" name="perimeter" value={formData.perimeter || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Corte</label>
            <input type="text" name="cut" value={formData.cut || ''} onChange={handleChange} className="w-full bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
            <div className="space-y-3">
              {(formData.observations || []).map((obs, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-semibold text-white uppercase">{obs}</p>
                  <button type="button" onClick={() => handleRemoveObservation(idx)} className="text-red-500 hover:text-red-700">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newObservation} 
                  onChange={(e) => setNewObservation(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddObservation();
                    }
                  }}
                  className="flex-1 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary uppercase font-semibold" 
                  placeholder="Nova observação..." 
                />
                <button type="button" onClick={handleAddObservation} className="flex items-center justify-center bg-primary text-background-dark px-4 rounded-lg font-bold hover:brightness-110">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              type="submit" 
              disabled={isSaving || isSuccess}
              className="w-full flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-background-dark font-extrabold text-lg hover:brightness-110 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined ${isSaving ? 'animate-spin' : ''}`}>
                {isSaving ? 'sync' : 'update'}
              </span>
              {isSaving ? 'ATUALIZANDO...' : 'ATUALIZAR REGISTRO'}
            </button>

            <button 
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este registro permanentemente?')) {
                  deleteProduct(id!);
                  navigate('/');
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <span className="material-symbols-outlined">delete</span>
              EXCLUIR REGISTRO
            </button>
          </div>
        </form>
      </main>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl border border-primary/20"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="size-20 bg-green-500 rounded-full flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-5xl">check</span>
              </motion.div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">PRODUTO ATUALIZADO!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Edit;
