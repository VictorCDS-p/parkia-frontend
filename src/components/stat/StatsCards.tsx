import { useQuery } from "@tanstack/react-query";
import { estatisticasVagas } from "../../api/vagas";
import { StatCard } from "../stat/StatCard";
import {
  CircleParking,
  Car,
  CarFront,
  Percent,
} from "lucide-react";

export default function StatsCards() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => estatisticasVagas().then((r) => r.data),
  });

  if (!data) return null;

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        title="Total de Vagas"
        value={data.total}
        icon={CircleParking}
        variant="default"
      />

      <StatCard
        title="Disponíveis"
        value={data.livres}
        icon={Car}
        variant="success"
      />

      <StatCard
        title="Ocupadas"
        value={data.ocupadas}
        icon={CarFront}
        variant="danger"
      />

      <StatCard
        title="Ocupação"
        value={`${data.percentualOcupacao}%`}
        icon={Percent}
        variant="warning"
      />
    </div>
  );
}
