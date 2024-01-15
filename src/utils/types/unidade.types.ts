export type TUnidadeEscolar = {
  _id: string;
  nome: string;
  userAdmin: string;
  inep: number;
  fone?: string;
  email: string;
  endereco?: {
    coordinates: {
      coordinateX: number;
      coordinateY: number;
    };
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
