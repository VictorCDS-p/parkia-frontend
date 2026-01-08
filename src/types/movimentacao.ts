export type TipoVeiculo = "CARRO" | "MOTO";

export interface Movimentacao {
  id: string;
  vagaId: string;
  placa: string;
  tipoVeiculo: TipoVeiculo;
  entrada: string;
  saida?: string;
  valorPago?: number;
}
