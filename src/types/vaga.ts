export type StatusVaga = "LIVRE" | "OCUPADA" | "MANUTENCAO";
export type TipoVaga = "CARRO" | "MOTO" | "DEFICIENTE";

export interface Vaga {
  tipoVeiculo: TipoVeiculo | null | undefined;
  id: string;
  numero: string;
  status: StatusVaga;
  tipo: TipoVaga;
}
