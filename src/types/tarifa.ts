import type { TipoVeiculo } from "./movimentacao";

export interface Tarifa {
  id: string;
  tipoVeiculo: TipoVeiculo;
  valorPrimeiraHora: number;
  valorHoraAdicional: number;
  toleranciaMinutos: number;
}
