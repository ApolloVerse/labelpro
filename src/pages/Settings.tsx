import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../types';

const Settings = () => {
  const { products, importProducts } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    // Converte de array interno para o formato de Dicionário
    const exportData: Record<string, any> = {};
    products.forEach(p => {
      // Transforma o timestamp Unix no formato "DD/MM/YYYY, HH:MM:SS"
      let formattedDate = '';
      if (p.createdAt) {
        const date = new Date(p.createdAt);
        formattedDate = date.toLocaleString('pt-BR');
      }

      exportData[p.name] = {
        repeticao: p.repetition || "",
        chagrim: p.chagrim || "Não",
        corte: p.cut ? parseFloat(p.cut) : null,
        velocidade: p.speed || "",
        perimetro: p.perimeter ? parseFloat(p.perimeter) : null,
        observacoes: Array.isArray(p.observations) ? p.observations : [],
        timestamp: formattedDate
      };
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        let productsToImport: Product[] = [];

        if (Array.isArray(json)) {
          // Suporte legado
          productsToImport = json as Product[];
        } else if (typeof json === 'object' && json !== null) {
          // Novo suporte ao formato Dicionário (ex: {"Nome": {"repeticao": "132", ...}})
          productsToImport = Object.keys(json).map(key => {
            const item = json[key];
            
            // Decodifica a data "02/06/2025, 22:00:08" para ms
            let createdAt = Date.now();
            if (item.timestamp) {
              const parts = item.timestamp.split(', ');
              if (parts.length === 2) {
                const [datePart, timePart] = parts;
                const dateParts = datePart.split('/');
                if (dateParts.length === 3) {
                  const [day, month, year] = dateParts;
                  // Formato ISO: YYYY-MM-DDTHH:MM:SS
                  const parsedDate = new Date(`${year}-${month}-${day}T${timePart}`);
                  if (!isNaN(parsedDate.getTime())) {
                    createdAt = parsedDate.getTime();
                  }
                }
              }
            }

            return {
              id: crypto.randomUUID(),
              name: key,
              image: '',
              repetition: item.repeticao?.toString() || '',
              chagrim: item.chagrim?.toString().toUpperCase() || '',
              cut: item.corte?.toString() || '',
              speed: item.velocidade?.toString() || '',
              perimeter: item.perimetro?.toString() || '',
              observations: Array.isArray(item.observacoes) ? item.observacoes.map(String) : [],
              createdAt,
              updatedAt: createdAt
            };
          });
        }

        if (productsToImport.length > 0) {
          importProducts(productsToImport);
          alert(`Backup processado com sucesso! ${productsToImport.length} produtos carregados.`);
        } else {
          alert('O arquivo JSON parece estar vazio ou em um formato desconhecido.');
        }
      } catch (err) {
        alert('Erro ao ler ou processar o arquivo JSON.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <Link to="/" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Configurações</h2>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-6 pb-24 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            Dados do Aplicativo
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            O aplicativo funciona offline guardando os dados no navegador. Você pode exportar uma cópia de segurança para não os perder, ou enviar para este aparelho.
          </p>
          
          <div className="flex flex-col gap-4 mt-6">
            <button 
              onClick={handleDownloadBackup}
              className="flex items-center justify-between p-4 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">download</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Fazer Backup</p>
                  <p className="text-xs text-slate-500">Baixar {products.length} registros (JSON)</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-between p-4 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">upload</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Restaurar Backup</p>
                  <p className="text-xs text-slate-500">Enviar arquivo .json</p>
                </div>
              </div>
              <input 
                type="file" 
                accept=".json,application/json,text/plain" 
                ref={fileInputRef} 
                onChange={handleUploadBackup} 
                className="hidden" 
              />
            </button>
          </div>
        </div>

      </main>
    </>
  );
};

export default Settings;
