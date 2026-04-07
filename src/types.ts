export interface Product {
  id: string;
  name: string; // Produto
  image?: string; // Imagem opcional para a lista
  speed?: string; // Velocidade
  repetition?: string; // Repetição
  chagrim?: string; // Chagrim (sim/não)
  paperType?: string; // Metal ou Couché
  perimeter?: string; // Perimetro
  cut?: string; // Corte
  observations?: string[]; // Múltiplas observações
  createdAt: number;
  updatedAt: number;
}
