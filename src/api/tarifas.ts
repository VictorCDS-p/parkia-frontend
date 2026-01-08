import { api } from "./client";
import type { Tarifa } from "../types/tarifa";

export const listarTarifas = () =>
  api.get<Tarifa[]>("/tarifas");

export const atualizarTarifa = (
  id: string,
  data: Partial<Pick<Tarifa, "valorPrimeiraHora" | "valorHoraAdicional" | "toleranciaMinutos">>
) =>
  api.put(`/tarifas/${id}`, data);
