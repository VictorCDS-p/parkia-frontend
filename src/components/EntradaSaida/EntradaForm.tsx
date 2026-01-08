import { useState } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entradaVeiculo } from "../../api/movimentacoes";
import { AxiosError } from "axios";
import { listarVagas } from "../../api/vagas";
import { Input } from "../ui/input";

export default function EntradaForm() {
  const queryClient = useQueryClient();

  const [vagaId, setVagaId] = useState("");
  const [placa, setPlaca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState<"CARRO" | "MOTO">("CARRO");
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  const { data: vagasLivres } = useQuery({
    queryKey: ["vagas", "LIVRE"],
    queryFn: () => listarVagas({ status: "LIVRE" }).then(r => r.data),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: entradaVeiculo,
    onSuccess: () => {
      setMensagem({ tipo: "sucesso", texto: "Entrada registrada com sucesso!" });
      setPlaca("");
      setVagaId("");
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setMensagem({ tipo: "erro", texto: error.response?.data?.message || "Erro ao registrar entrada" });
    },
  });

  const submit = () => {
    if (!vagaId || !placa) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos" });
      return;
    }
    setMensagem(null);
    mutate({ vagaId, placa, tipoVeiculo });
  };

  return (
    <div
      className="
        flex flex-col gap-4 p-4 rounded-xl border border-border bg-background/50 shadow-sm
        max-h-125 overflow-y-auto
        scrollbar-thin scrollbar-thumb-primary scrollbar-track-background/30
        scrollbar-thumb-rounded-full scrollbar-track-rounded-full
      "
    >
      <h3 className="text-sm font-semibold text-foreground">Formulário de Entrada</h3>

      <label className="flex flex-col text-xs text-muted-foreground font-medium">
        Selecione uma vaga livre:
        <select
          value={vagaId}
          onChange={(e) => setVagaId(e.target.value)}
          className="mt-1 flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground transition-all hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">Selecionar opção</option>
          {vagasLivres?.map((vaga) => (
            <option key={vaga.id} value={vaga.id}>{vaga.numero}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-xs text-muted-foreground font-medium">
        Placa do veículo:
        <Input
          placeholder="Ex: ABC1D23"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          className="mt-1"
        />
      </label>

      <label className="flex flex-col text-xs text-muted-foreground font-medium">
        Tipo de veículo:
        <select
          value={tipoVeiculo}
          onChange={(e) => setTipoVeiculo(e.target.value as "CARRO" | "MOTO")}
          className="mt-1 flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground transition-all hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="CARRO">Carro</option>
          <option value="MOTO">Moto</option>
        </select>
      </label>

      {mensagem && (
        <p className={`text-sm font-medium text-center ${mensagem.tipo === "erro" ? "text-red-500" : "text-green-500"}`}>
          {mensagem.texto}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className={`
          mt-2 w-full flex items-center justify-center gap-2
          rounded-2xl border-2 border-primary bg-primary text-primary-foreground
          py-2 text-sm font-semibold
          transition-all duration-150
          hover:bg-primary/90 hover:scale-105 hover:shadow-md
          active:scale-95 active:shadow-sm
          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {isPending ? "Registrando..." : "Registrar Entrada"}
      </button>
    </div>
  );
}
