import FichaForm from "@/components/forms/fichaForm";
import MainTitle from "@/components/texts/mainTitle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MainTitle text="Criar Ficha Catalográfica"/>
      <FichaForm/>
      <div className="background-main"></div>
    </main>
  );
}
