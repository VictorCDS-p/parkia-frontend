import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarVagas, criarVaga, atualizarVaga, excluirVaga } from "../../api/vagas";
import { AxiosError } from "axios";
import { ParkingSpot } from "./ParkingSpot";
import type { Vaga as VagaType } from "../../types/vaga";
import { Car, Bike, Plus, Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";
import { listarAtivas } from "../../api/movimentacoes";

interface Movimentacao {
  vaga: {
    numero: string;
  };
  saida: string | null;
}

const tiposVaga: ("RESETAR" | "CARRO" | "MOTO")[] = ["RESETAR", "CARRO", "MOTO"];
const statusTipos: ("RESETAR" | "LIVRE" | "OCUPADA" | "MANUTENCAO")[] = [
  "RESETAR",
  "LIVRE",
  "OCUPADA",
  "MANUTENCAO",
];

export default function VagasGrid() {
  const queryClient = useQueryClient();
  const [tipoFiltro, setTipoFiltro] = useState<"RESETAR" | "CARRO" | "MOTO">("RESETAR");
  const [statusFiltro, setStatusFiltro] = useState<"RESETAR" | "LIVRE" | "OCUPADA" | "MANUTENCAO">("RESETAR");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaga, setEditingVaga] = useState<VagaType | null>(null);
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "CARRO" as "CARRO" | "MOTO",
    status: "LIVRE" as "LIVRE" | "OCUPADA" | "MANUTENCAO",
  });

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const { data: vagas } = useQuery({
    queryKey: ["vagas"],
    queryFn: () => listarVagas().then((r) => r.data),
  });

  const { data: movimentacoes } = useQuery({
    queryKey: ["movimentacoes"],
    queryFn: () => listarAtivas().then((r) => r.data),
  });



  const createMutation = useMutation({
    mutationFn: (data: { numero: string; tipo: string }) => 
      criarVaga({ numero: data.numero, tipo: data.tipo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      setIsModalOpen(false);
      showNotification("success", "Vaga criada com sucesso!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Erro ao criar vaga:", error);
      showNotification("error", error.response?.data?.message || "Erro ao criar vaga. Verifique se o número já existe.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; numero: string; tipo: "CARRO" | "MOTO"; status: "LIVRE" | "OCUPADA" | "MANUTENCAO" }) =>
      atualizarVaga(data.id, { numero: data.numero, tipo: data.tipo, status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      setIsModalOpen(false);
      showNotification("success", "Vaga atualizada com sucesso!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Erro ao atualizar vaga:", error);
      showNotification("error", error.response?.data?.message || "Erro ao atualizar vaga.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => excluirVaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      setDeleteId(null);
      showNotification("success", "Vaga excluída com sucesso!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Erro ao excluir vaga:", error);
      setDeleteId(null);
      showNotification("error", error.response?.data?.message || "Erro ao excluir vaga. Tente recarregar a página.");
    }
  });

  const handleOpenCreate = () => {
    setEditingVaga(null);
    setFormData({ numero: "", tipo: "CARRO", status: "LIVRE" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vaga: VagaType) => {
    setEditingVaga(vaga);
    setFormData({
      numero: vaga.numero,
      tipo: vaga.tipo as "CARRO" | "MOTO",
      status: vaga.status as "LIVRE" | "OCUPADA" | "MANUTENCAO",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (id) {
      setDeleteId(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVaga) {
      updateMutation.mutate({
        id: editingVaga.id ?? editingVaga.numero,
        numero: formData.numero,
        tipo: formData.tipo,
        status: formData.status,
      });
    } else {
      createMutation.mutate({
        numero: formData.numero,
        tipo: formData.tipo
      });
    }
  };

  if (!vagas) return null;

  const vagasAtualizadas = vagas.map((vaga) => {
    const movimentacao = movimentacoes?.find(
      (m: Movimentacao) => m.vaga?.numero === vaga.numero && m.saida === null
    );

    if (movimentacao) {
      return {
        ...vaga,
        movimentacao: {
          tipoVeiculo: movimentacao.tipoVeiculo,
          placa: movimentacao.placa,
        },
      };
    }
    return vaga;
  });

  const vagasFiltradas = vagasAtualizadas.filter((vaga) => {
    const tipoMatch = tipoFiltro === "RESETAR" || vaga.tipo.toUpperCase() === tipoFiltro;
    const statusMatch = statusFiltro === "RESETAR" || vaga.status.toUpperCase() === statusFiltro;
    return tipoMatch && statusMatch;
  });

  const statusColors = {
    LIVRE: "bg-green-500",
    OCUPADA: "bg-red-500",
    MANUTENCAO: "bg-zinc-400",
  };
  return (
    <div className="relative rounded-xl border border-border bg-background/50 p-4">
      {notification && (
        <div className={`fixed top-4 right-4 z-100 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all animate-in slide-in-from-right-5 ${
          notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 opacity-80 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-semibold text-foreground">Mapa de Vagas</h4>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Plus className="h-3 w-3" />
            Nova Vaga
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {statusTipos.map((status) => {
            const isActive = status !== "RESETAR" && statusFiltro === status;
            const label = status === "RESETAR" ? "Resetar filtros" : status.charAt(0) + status.slice(1).toLowerCase();
            const colorDot = statusColors[status as keyof typeof statusColors] || "bg-muted";

            return (
              <button
                key={status}
                onClick={() => setStatusFiltro(status)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all
                  cursor-pointer
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-muted text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm hover:scale-105"
                  }
                  active:scale-95
                  group
                `}
              >
                {status !== "RESETAR" && <span className={`h-2 w-2 rounded-full ${colorDot}`} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="h-1 flex-1 rounded-full bg-secondary/40" />
        <div className="h-1 flex-1 rounded-full bg-secondary/40" />
      </div>

      <div className="grid grid-cols-6 gap-2 mb-10">
        {vagasFiltradas.map((vaga: VagaType) => (
          <div key={vaga.numero} className="relative group">
            <ParkingSpot vaga={vaga} />
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 z-10">
              <button
                onClick={() => handleOpenEdit(vaga)}
                className="cursor-pointer transition-all hover:scale-110 rounded-full bg-background/80 p-1 text-foreground shadow-sm hover:bg-background border border-border"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(vaga.id || vaga.numero);
                }}
                className="cursor-pointer transition-all hover:scale-110 rounded-full bg-background/80 p-1 text-destructive shadow-sm hover:bg-background border border-border"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <div className="flex gap-2 flex-wrap">
          {tiposVaga.map((tipo) => {
            const isActive = tipo !== "RESETAR" && tipoFiltro === tipo;
            const Icon = tipo === "CARRO" ? Car : tipo === "MOTO" ? Bike : null;

            return (
              <button
                key={tipo}
                onClick={() => setTipoFiltro(tipo)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-muted text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm hover:scale-105"
                  }
                  active:scale-95
                  group
                `}
              >
                {Icon && <Icon className="h-3 w-3 text-current opacity-70 group-hover:opacity-100 transition-all" />}
                <span>{tipo === "RESETAR" ? "Resetar filtros" : tipo.charAt(0) + tipo.slice(1).toLowerCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-1 flex-1 rounded-full bg-secondary/40" />
        <div className="h-1 flex-1 rounded-full bg-secondary/40" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingVaga ? "Editar Vaga" : "Nova Vaga"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Número</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "CARRO" | "MOTO" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="CARRO">Carro</option>
                  <option value="MOTO">Moto</option>
                </select>
              </div>
              {editingVaga && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "LIVRE" | "OCUPADA" | "MANUTENCAO" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="LIVRE">Livre</option>
                  <option value="OCUPADA">Ocupada</option>
                  <option value="MANUTENCAO">Manutenção</option>
                </select>
              </div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cursor-pointer transition-all hover:scale-105 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">Cancelar</button>
                <button type="submit" className="cursor-pointer transition-all hover:scale-105 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Confirmar Exclusão</h3>
              <button onClick={() => setDeleteId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="cursor-pointer transition-all hover:scale-105 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                className="cursor-pointer transition-all hover:scale-105 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
