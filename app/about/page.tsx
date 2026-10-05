import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <div className="pt-32 px-6 sm:px-10 lg:px-14 max-w-[1360px] mx-auto min-h-[60vh]">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8">О нас</h1>
        <p className="text-white/60 text-lg max-w-2xl">
          Ведущее рекламное агентство полного цикла в Балаково с 2004 года.
          Страница находится в стадии разработки.
        </p>
      </div>
      <Footer />
    </main>
  );
}
