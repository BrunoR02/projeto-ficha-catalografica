import FichaComp from "@/component/FichaComp";
import MainTitle from "@/component/texts/MainTitle";

export default function Home() {
  return (
    <main>
      <MainTitle text="Criar Ficha Catalográfica" />
      <FichaComp />
    </main>
  );
}
