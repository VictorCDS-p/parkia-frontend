import { useState, useMemo } from "react";
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

type TipoVeiculo = "CARRO" | "MOTO";
type FeedbackType = "success" | "error" | "info";

type EditValues = Record<
  string,
  Partial<Record<keyof Tarifa, string>>
>;

export default function TarifasSection() {
  const queryClient = useQueryClient();

  const [tipoSelecionado, setTipoSelecionado] =
    useState<TipoVeiculo | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
  } | null>(null);

  const { data: tarifas } = useQuery<Tarifa[]>({
    queryKey: ["tarifas"],
    queryFn: () => listarTarifas().then((r) => r.data),
  });

  const tarifaSelecionada = useMemo(() => {
    if (!tarifas || !tipoSelecionado) return null;
    return tarifas.find((t) => t.tipoVeiculo === tipoSelecionado);
  }, [tarifas, tipoSelecionado]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tarifa> }) =>
      atualizarTarifa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarifas"] });
      setEditValues({});
      setFieldErrors({});
      setFeedback({ type: "success", message: "Tarifa atualizada com sucesso!" });
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erro ao atualizar tarifa." });
    },
  });

  function handleInputChange(
    id: string,
    field: keyof Tarifa,
    value: string,
  ) {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));

    if (value.trim() === "") {
      setFieldErrors((prev) => ({
        ...prev,
        [`${id}-${field}`]: "Campo obrigatório",
      }));
      return;
    }

    if (Number(value) <= 0) {
      setFieldErrors((prev) => ({
        ...prev,
        [`${id}-${field}`]: "Digite um valor maior que zero",
      }));
    } else {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[`${id}-${field}`];
        return copy;
      });
    }
  }

  function buildPayload(values: Partial<Record<keyof Tarifa, string>>) {
    const payload: Partial<Tarifa> = {};

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== "") {
        (payload[key as keyof Tarifa] as number) = Number(value);
      }
    }

    return payload;
  }

  function handleConfirmar() {
    if (!tarifaSelecionada) return;

    const values = editValues[tarifaSelecionada.id];
    if (!values) {
      setFeedback({ type: "info", message: "Nenhuma alteração realizada." });
      return;
    }

    if (
      Object.keys(fieldErrors).some((k) =>
        k.startsWith(tarifaSelecionada.id),
      )
    ) {
      setFeedback({
        type: "error",
        message: "Corrija os erros antes de salvar.",
      });
      return;
    }

    const payload = buildPayload(values);

    if (Object.keys(payload).length === 0) {
      setFeedback({
        type: "info",
        message: "Nenhuma alteração válida.",
      });
      return;
    }

    mutation.mutate({
      id: tarifaSelecionada.id,
      data: payload,
    });
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-center">
        Configuração de Tarifas
      </h2>

      <div className="flex gap-4 justify-center">
        {(["CARRO", "MOTO"] as TipoVeiculo[]).map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => setTipoSelecionado(tipo)}
            className={`px-6 py-2 rounded-2xl font-semibold border-2 transition-all cursor-pointer
              ${
                tipoSelecionado === tipo
                  ? "bg-primary text-primary-foreground border-primary hover:scale-105"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/20 hover:scale-105"
              } active:scale-95`}
          >
            {tipo === "CARRO" ? "🚗 CARRO" : "🏍️ MOTO"}
          </button>
        ))}
      </div>

      {feedback && (
        <p className="text-sm text-center font-medium">{feedback.message}</p>
      )}

      {tarifaSelecionada && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl border space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {(
              [
                ["valorPrimeiraHora", "1ª Hora (R$)"],
                ["valorHoraAdicional", "Hora Adicional (R$)"],
                ["toleranciaMinutos", "Tolerância (min)"],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <label className="text-xs text-muted-foreground">
                  {label}
                </label>
                <Input
                  type="number"
                  value={
                    editValues[tarifaSelecionada.id]?.[field] ??
                    String(tarifaSelecionada[field])
                  }
                  onChange={(e) =>
                    handleInputChange(
                      tarifaSelecionada.id,
                      field,
                      e.target.value,
                    )
                  }
                />
                {fieldErrors[`${tarifaSelecionada.id}-${field}`] && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors[`${tarifaSelecionada.id}-${field}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConfirmar}
            className="w-full rounded-2xl border-2 border-primary bg-primary py-2 font-semibold hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Confirmar Alterações
          </button>
        </div>
      )}
    </section>
  );
}
