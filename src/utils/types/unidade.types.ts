export type TUnidadeEscolar = {
  _id: string;
  nome: string;
  userId: string[];
  inep: number;
  fone?: string;
  email: string;
  coordinates: number[];
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
