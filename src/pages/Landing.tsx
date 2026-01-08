import StatsCards from "../components/stat/StatsCards";
import VagasGrid from "../components/grid/VagasGrid";
import EntradaForm from "../components/EntradaSaida/EntradaForm";
import SaidaForm from "../components/EntradaSaida/SaidaForm";
import TarifasSection from "../components/Tarifas/TarifasSection";

export default function Landing() {
  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">PARKIA</h1>
        <p className="text-gray-500">
          Plataforma de Estacionamento Inteligente
        </p>
      </header>

      <StatsCards />

      <section>
        <VagasGrid />
      </section>

      <section className="grid grid-cols-2 gap-6">
        <EntradaForm />
        <SaidaForm />
      </section>

      <TarifasSection />
    </div>
  );
}
