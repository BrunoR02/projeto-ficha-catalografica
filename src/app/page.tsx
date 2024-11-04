import FichaComp from "@/component/FichaComp";
import MainTitle from "@/component/texts/MainTitle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MainTitle text="Criar Ficha Catalográfica" />
      <FichaComp />
    </main>
  );
}
