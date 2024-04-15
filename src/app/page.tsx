import FichaComp from "@/components/fichaComp";
import MainTitle from "@/components/texts/mainTitle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MainTitle text="Página inicial"/>
      <FichaComp/>
    </main>
  );
}
