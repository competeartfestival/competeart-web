import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inscricao from "./pages/Inscricao";
import Elenco from "./pages/Elenco";
import Coreografias from "./pages/Coreografias";
import Resumo from "./pages/Resumo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscricao" element={<Inscricao />} />
        <Route path="/inscricao/:escolaId/elenco" element={<Elenco />} />
        <Route
          path="/inscricao/:escolaId/coreografias"
          element={<Coreografias />}
        />{" "}
        <Route path="/inscricao/:escolaId/resumo" element={<Resumo />} />
      </Routes>
    </BrowserRouter>
  );
}
