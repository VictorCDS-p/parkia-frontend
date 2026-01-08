import { Car, Bike, ParkingCircle } from "lucide-react";
import clsx from "clsx";
import { parkingSpotStyles } from "./parkingSpotStyles";

type Status = "LIVRE" | "OCUPADA" | "MANUTENCAO";
type TipoVeiculo = "CARRO" | "MOTO";
type TipoVaga = "CARRO" | "MOTO" | "DEFICIENTE";

interface Movimentacao {
  tipoVeiculo: TipoVeiculo;
  placa: string;
}

interface Vaga {
  numero: string;
  status: Status;
  tipo: TipoVaga;
  movimentacao?: Movimentacao | null;
}

interface Props {
  vaga: Vaga;
}

export function ParkingSpot({ vaga }: Props) {
  const styles = parkingSpotStyles[vaga.status];

  const iconColor =
    vaga.status === "LIVRE"
      ? "text-green-500"
      : vaga.status === "OCUPADA"
      ? "text-red-500"
      : "text-gray-400";

  const tipo =
    vaga.status === "OCUPADA" && vaga.movimentacao
      ? vaga.movimentacao.tipoVeiculo.toUpperCase()
      : vaga.tipo.toUpperCase();

  let IconComponent;
  if (tipo === "MOTO") {
    IconComponent = <Bike className={clsx("h-5 w-5", iconColor)} />;
  } else if (tipo === "CARRO") {
    IconComponent = <Car className={clsx("h-5 w-5", iconColor)} />;
  } else {
    IconComponent = <ParkingCircle className={clsx("h-5 w-5", iconColor)} />;
  }

  return (
    <div
      className={clsx(
        "flex h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-xs font-medium transition-all hover:scale-105 cursor-pointer shadow-sm hover:shadow-md",
        styles.container,
        styles.border
      )}
    >
      {IconComponent}
      <span className="font-semibold">{vaga.numero}</span>
      {vaga.status === "OCUPADA" && vaga.movimentacao && (
        <span className="text-[10px] font-bold uppercase">{vaga.movimentacao.placa}</span>
      )}
    </div>
  );
}
