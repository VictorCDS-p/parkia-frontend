import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarTarifas, atualizarTarifa } from "../../api/tarifas";
import { Input } from "../ui/input";

interface Tarifa {
  id: string;
  tipoVeiculo: "CARRO" | "MOTO";
  valorPrimeiraHora: number;
  valorHoraAdicional: number;
  toleranciaMinutos: number;
}

export default function TarifasSection() {
  const queryClient = useQueryClient();
  const [placa, setPlaca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, Record<string, string>>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const { data: tarifas } = useQuery<Tarifa[]>({
    queryKey: ["tarifas"],
    queryFn: () => listarTarifas().then(r => r.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tarifa> }) => atualizarTarifa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarifas"] });
      setFeedback({ type: "success", message: "Tarifa atualizada com sucesso!" });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erro ao atualizar tarifa." });
    },
  });

  const handleInputChange = (id: string, field: keyof Tarifa, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleConfirmar = (id: string) => {
    const values = editValues[id];
    if (!values) return;
    const data: Partial<Tarifa> = {};
    if (values.valorPrimeiraHora) data.valorPrimeiraHora = parseFloat(values.valorPrimeiraHora);
    if (values.valorHoraAdicional) data.valorHoraAdicional = parseFloat(values.valorHoraAdicional);
    if (values.toleranciaMinutos) data.toleranciaMinutos = parseInt(values.toleranciaMinutos);
    mutation.mutate({ id, data });
  };

  const handleBuscarPlaca = async () => {
    if (!placa) {
      setFiltroTipo(null);
      setFeedback(null);
      return;
    }
    setFeedback({ type: "info", message: "Buscando veículo..." });
    try {
      const response = await fetch(`http://localhost:3000/movimentacoes?placa=${placa}`);
      const data = await response.json();
      let movimento = null;
      if (Array.isArray(data)) {
        const encontrados = data.filter((m: { placa?: string }) => m.placa?.toUpperCase() === placa);
        encontrados.sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        movimento = encontrados[0];
      } else {
        movimento = data?.placa?.toUpperCase() === placa ? data : null;
      }
      if (movimento?.tipoVeiculo) {
        setFiltroTipo(movimento.tipoVeiculo.toUpperCase());
        setFeedback({ type: "success", message: `Veículo encontrado: ${movimento.tipoVeiculo.toUpperCase()}` });
      } else {
        setFiltroTipo(null);
        setFeedback({ type: "error", message: "Veículo não encontrado ou sem movimentações." });
      }
    } catch {
      setFeedback({ type: "error", message: "Erro ao buscar informações do veículo." });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground text-center">Configuração de Tarifas</h2>

      <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-background/50 shadow-sm items-center">
        <div className="w-full md:w-72 text-center">
          <label className="text-xs text-muted-foreground block mb-1">Buscar Tarifa por Placa</label>
          <Input
            placeholder="ABC-1234"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          />
        </div>

        <div className="flex gap-2 w-full md:w-72 justify-center">
          <button
            onClick={handleBuscarPlaca}
            className="flex-1 rounded-2xl border-2 border-primary bg-primary text-primary-foreground py-2 text-sm font-semibold hover:bg-primary/80 hover:scale-105 transition-all cursor-pointer"
          >
            Buscar
          </button>
          {filtroTipo && (
            <button
              onClick={() => { setFiltroTipo(null); setPlaca(""); setFeedback(null); }}
              className="flex-1 rounded-2xl border-2 border-muted bg-background text-muted-foreground py-2 text-sm font-semibold hover:bg-muted/20 hover:scale-105 transition-all cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {feedback && (
          <p className={`text-sm font-medium text-center mt-2 ${
            feedback.type === "success" ? "text-green-500" :
            feedback.type === "error" ? "text-red-500" : "text-blue-500"
          }`}>
            {feedback.message}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {tarifas?.filter(t => t.tipoVeiculo === filtroTipo).map((t) => (
          <div key={t.id} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-background/50 shadow-sm">
            <div className="w-full font-bold flex items-center justify-center gap-2 text-foreground text-center text-lg">
              {t.tipoVeiculo === "CARRO" ? "🚗" : "🏍️"} {t.tipoVeiculo}
            </div>

            <div className="grid md:grid-cols-3 gap-4 w-full">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">1ª Hora (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  disabled={!filtroTipo}
                  value={editValues[t.id]?.valorPrimeiraHora ?? t.valorPrimeiraHora}
                  onChange={(e) => handleInputChange(t.id, "valorPrimeiraHora", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Hora Adicional (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  disabled={!filtroTipo}
                  value={editValues[t.id]?.valorHoraAdicional ?? t.valorHoraAdicional}
                  onChange={(e) => handleInputChange(t.id, "valorHoraAdicional", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Tolerância (min)</label>
                <Input
                  type="number"
                  disabled={!filtroTipo}
                  value={editValues[t.id]?.toleranciaMinutos ?? t.toleranciaMinutos}
                  onChange={(e) => handleInputChange(t.id, "toleranciaMinutos", e.target.value)}
                />
              </div>
            </div>

            {filtroTipo && (
              <button
                onClick={() => handleConfirmar(t.id)}
                className="w-full rounded-2xl border-2 border-primary bg-primary text-primary-foreground py-2 px-4 text-sm font-semibold hover:bg-primary/80 hover:scale-101 transition-all cursor-pointer mt-2"
              >
                Confirmar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
