import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { QuoteBar } from "./components/QuoteBar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { PlanDetail } from "./pages/PlanDetail";

/** Ao trocar de rota: rola ao topo, ou ao elemento do hash quando houver. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-dvh bg-obsidian text-platinum antialiased">
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plano/:slug" element={<PlanDetail />} />
        </Routes>
      </main>
      <Footer />
      <QuoteBar />
    </div>
  );
}
