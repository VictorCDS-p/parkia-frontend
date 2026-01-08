import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saidaVeiculo, listarAtivas, getTarifas } from "../../api/movimentacoes";
import { AxiosError } from "axios";
import { Input } from "../ui/input";

export default function SaidaForm() {
  const queryClient = useQueryClient();

  const [placa, setPlaca] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [valorPago, setValorPago] = useState<number | null>(null);
  const [valorEstimado, setValorEstimado] = useState<number | null>(null);
  const [tempoPermanencia, setTempoPermanencia] = useState<string>("");
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  // Mutation para calcular o valor no FRONTEND
  const { mutate: calcular, isPending: isCalculando } = useMutation({
    mutationFn: async (placaBusca: string) => {
      // 1. Buscar dados necessários (Movimentações ativas e Tarifas)
      const [movimentacoesRes, tarifasRes] = await Promise.all([
        listarAtivas(),
        getTarifas()
      ]);

      // 2. Encontrar o veículo
      const veiculo = movimentacoesRes.data.find((m: { placa: string; tipoVeiculo: string; entrada: string }) => m.placa === placaBusca);
      if (!veiculo) throw new Error("Veículo não encontrado ou já saiu.");

      // 3. Encontrar a tarifa correspondente
      const tarifa = tarifasRes.data.find((t: { tipoVeiculo: string; toleranciaMinutos: number; valorPrimeiraHora: number; valorHoraAdicional: number }) => t.tipoVeiculo === veiculo.tipoVeiculo);
      if (!tarifa) throw new Error(`Tarifa não configurada para ${veiculo.tipoVeiculo}`);

      // 4. Calcular tempo e valor
      const entrada = new Date(veiculo.entrada);
      const agora = new Date();
      const diffMs = agora.getTime() - entrada.getTime();
      const minutosTotais = Math.floor(diffMs / 60000);

      // Formatar tempo para exibição (ex: 1h 30min)
      const horasExibicao = Math.floor(minutosTotais / 60);
      const minutosExibicao = minutosTotais % 60;
      const textoTempo = `${horasExibicao}h ${minutosExibicao}min`;

      // Regra de Tolerância
      if (minutosTotais <= (tarifa.toleranciaMinutos || 15)) {
        return { valor: 0, tempo: textoTempo };
      }

      // Regra de Cobrança
      let valor = tarifa.valorPrimeiraHora;
      const horasAdicionais = Math.ceil((minutosTotais - 60) / 60);
      if (horasAdicionais > 0) {
        valor += horasAdicionais * tarifa.valorHoraAdicional;
      }

      return { valor, tempo: textoTempo };
    },
    onSuccess: (resultado) => {
      setValorEstimado(resultado.valor);
      setTempoPermanencia(resultado.tempo);
      setConfirmar(true);
      setMensagem(null);
    }, 
    onError: (error: Error) => {
      setMensagem({ tipo: "erro", texto: error.message || "Erro ao calcular valor" });
    },
  });

  // Mutation para registrar a saída (Final)
  const { mutate: registrarSaida, isPending: isRegistrando } = useMutation({
    mutationFn: saidaVeiculo,
    onSuccess: (response) => {
      setValorPago(response.data.valorPago);
      setMensagem({ tipo: "sucesso", texto: `Saída registrada! Valor pago: R$ ${response.data.valorPago.toFixed(2)}` });

      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setMensagem({ tipo: "erro", texto: error.response?.data?.message || "Erro ao registrar saída" });
      setConfirmar(false);
    },
  });

  const solicitarConfirmacao = () => {
    if (!placa) {
      setMensagem({ tipo: "erro", texto: "Preencha a placa do veículo" });
      return;
    }
    setMensagem(null);
    calcular(placa);
  };

  const confirmarSaida = () => {
    setMensagem(null);
    registrarSaida(placa);
  };

  const reset = () => {
    setPlaca("");
    setValorPago(null);
    setValorEstimado(null);
    setTempoPermanencia("");
    setConfirmar(false);
    setMensagem(null);
  };

  // Layout principal
  return (
    <div
      className="
        flex flex-col gap-4 p-4 rounded-xl border border-border bg-background/50 shadow-sm
        max-h-125 overflow-y-auto
        scrollbar-thin scrollbar-thumb-primary scrollbar-track-background/30
        scrollbar-thumb-rounded-full scrollbar-track-rounded-full
      "
    >
      <h3 className="text-sm font-semibold text-foreground">Formulário de Saída</h3>

      {mensagem && (
        <p className={`text-sm font-medium text-center ${mensagem.tipo === "erro" ? "text-red-500" : "text-green-500"}`}>
          {mensagem.texto}
        </p>
      )}

      {valorPago === null && (
        <>
          <label className="flex flex-col text-xs text-muted-foreground font-medium">
            Placa do veículo:
            <Input
              placeholder="Ex: ABC1D23"
              value={placa}
              onChange={(e) => {
                setPlaca(e.target.value.toUpperCase());
                setMensagem(null);
              }}
              disabled={confirmar || isCalculando || isRegistrando}
              className="mt-1"
            />
          </label>

          {!confirmar ? (
            <button
              type="button"
              onClick={solicitarConfirmacao}
              className={`
                mt-2 w-full flex items-center justify-center gap-2
                rounded-2xl border-2 border-primary bg-primary text-primary-foreground
                py-2 text-sm font-semibold
                transition-all duration-150
                hover:bg-primary/90 hover:scale-105 hover:shadow-md
                active:scale-95 active:shadow-sm
                ${isCalculando ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {isCalculando ? "Calculando..." : "Calcular Saída"}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Confirmar saída do veículo <strong>{placa}</strong>?
              </p>

              {valorEstimado !== null && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tempo: {tempoPermanencia}</span>
                    <span>Estimado</span>
                  </div>
                  <p className="text-xs text-green-800 text-center uppercase font-bold">Valor a Pagar</p>
                  <p className="text-2xl font-bold text-green-700 text-center">
                    R$ {valorEstimado.toFixed(2)}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={confirmarSaida}
                disabled={isRegistrando}
                className={`
                  w-full flex items-center justify-center gap-2
                  rounded-2xl border-2 border-primary bg-primary text-primary-foreground
                  py-2 text-sm font-semibold
                  transition-all duration-150
                  hover:bg-primary/90 hover:scale-105 hover:shadow-md
                  active:scale-95 active:shadow-sm
                  ${isRegistrando ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {isRegistrando ? "Confirmando..." : "Confirmar Saída"}
              </button>

              <button
                type="button"
                onClick={reset}
                className={`
                  w-full flex items-center justify-center gap-2
                  rounded-2xl border-2 border-muted bg-background text-muted-foreground
                  py-2 text-sm font-semibold
                  transition-all duration-150
                  hover:bg-muted/10 hover:scale-105 hover:shadow-sm
                  active:scale-95 active:shadow-sm
                `}
              >
                Cancelar
              </button>
            </div>
          )}
        </>
      )}

      {valorPago !== null && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Saída Registrada</p>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">Valor pago</p>
            <p className="text-3xl font-bold text-green-900 text-center">
              R$ {valorPago.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className={`
              w-full flex items-center justify-center gap-2
              rounded-2xl border-2 border-primary bg-primary text-primary-foreground
              py-2 text-sm font-semibold
              transition-all duration-150
              hover:bg-primary/90 hover:scale-105 hover:shadow-md
              active:scale-95 active:shadow-sm
            `}
          >
            Nova Saída
          </button>
        </div>
      )}
    </div>
  );
}
