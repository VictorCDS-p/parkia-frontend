export const parkingSpotStyles = {
  LIVRE: {
    container:
      "bg-green-950/60 border-green-600/60 text-green-400",
    border: "border-dashed",
    icon: "text-green-400",
  },

  OCUPADA: {
    container:
      "bg-red-950/60 border-red-600/60 text-red-400",
    border: "border-dashed",
    icon: "text-red-400",
  },

  MANUTENCAO: {
    container:
      "bg-zinc-800/80 border-zinc-500/60 text-zinc-300",
    border: "border-dashed",
    icon: "text-zinc-300",
  },
} as const;
