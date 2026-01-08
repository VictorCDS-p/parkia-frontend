import { api } from "./client";
import type { Vaga } from "../types/vaga";

interface ListarVagasParams {
  status?: string; 
  tipo?: string;   
}

export const listarVagas = ({ status, tipo }: ListarVagasParams = {}) =>
  api.get<Vaga[]>("/vagas", { params: { status, tipo } });

export const estatisticasVagas = () =>
  api.get("/vagas/estatisticas");

export const criarVaga = (data: { numero: string; tipo: string }) =>
  api.post("/vagas", data);

export const atualizarVaga = (id: string, data: Partial<Vaga>) =>
  api.put(`/vagas/${encodeURIComponent(id)}`, data);

export const excluirVaga = (id: string) =>
  api.delete(`/vagas/${encodeURIComponent(id)}`);
