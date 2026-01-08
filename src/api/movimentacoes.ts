import { api } from "./client";

export const entradaVeiculo = (data: {
  vagaId: string;
  placa: string;
  tipoVeiculo: string;
}) => api.post("/movimentacoes/entrada", data);

export const saidaVeiculo = (placa: string) =>
  api.post("/movimentacoes/saida", { placa });

export const listarAtivas = () =>
  api.get("/movimentacoes");

export const historico = (params?: unknown) =>
  api.get("/movimentacoes/historico", { params });

export const getTarifas = () =>
  api.get("/tarifas");
