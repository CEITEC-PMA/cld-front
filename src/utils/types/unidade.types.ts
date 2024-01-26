export type TUnidadeEscolar = {
  id: string;
  nome: string;
  userId: string[];
  inep: number;
  fone?: string;
  email: string;
  location: {
    coordinates: string[];
  };
  endereco?: {
    cep?: string;
    logradouro?: string;
    complemento?: string;
    quadra?: number;
    lote?: number;
    bairro?: string;
    localidade?: string;
    uf?: string;
  };
};
