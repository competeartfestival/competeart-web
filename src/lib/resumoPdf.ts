import { jsPDF } from "jspdf";

type CampoPdf = {
  rotulo: string;
  valor: string | number | null | undefined;
};

type SecaoListaPdf = {
  titulo: string;
  itens: string[];
};

type BlocoPdf = {
  titulo: string;
  campos?: CampoPdf[];
  listas?: SecaoListaPdf[];
};

type TotaisPdf = {
  coreografias: number;
  profissionaisExtras?: number;
  total: number;
};

type GerarResumoPdfInput = {
  nomeArquivo: string;
  titulo: string;
  subtitulo?: string;
  blocos: BlocoPdf[];
  totais: TotaisPdf;
};

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor);
}

function normalizarTexto(valor: string | number | null | undefined) {
  if (valor == null) return "-";
  return String(valor);
}

export function gerarResumoPdf({
  nomeArquivo,
  titulo,
  subtitulo,
  blocos,
  totais,
}: GerarResumoPdfInput) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const larguraPagina = doc.internal.pageSize.getWidth();
  const alturaPagina = doc.internal.pageSize.getHeight();
  const margem = 16;
  const larguraUtil = larguraPagina - margem * 2;
  let y = 18;

  function garantirEspaco(alturaNecessaria: number) {
    if (y + alturaNecessaria <= alturaPagina - margem) return;
    doc.addPage();
    y = 18;
  }

  function escreverTexto(texto: string, tamanho = 10, cor = 230) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(tamanho);
    doc.setTextColor(cor);
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    garantirEspaco(linhas.length * (tamanho * 0.45) + 2);
    doc.text(linhas, margem, y);
    y += linhas.length * (tamanho * 0.45) + 2;
  }

  function escreverTitulo(texto: string, tamanho = 18) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(tamanho);
    doc.setTextColor(18, 18, 18);
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    garantirEspaco(linhas.length * (tamanho * 0.45) + 3);
    doc.text(linhas, margem, y);
    y += linhas.length * (tamanho * 0.45) + 3;
  }

  function escreverRotuloValor(rotulo: string, valor: string) {
    const texto = `${rotulo}: ${valor}`;
    escreverTexto(texto, 10, 55);
  }

  escreverTitulo(titulo);
  if (subtitulo) {
    escreverTexto(subtitulo, 10, 90);
  }

  y += 3;

  blocos.forEach((bloco) => {
    const quantidadeCampos = bloco.campos?.length ?? 0;
    const quantidadeListas = bloco.listas?.reduce(
      (total, lista) => total + lista.itens.length + 1,
      0,
    ) ?? 0;
    garantirEspaco(14 + quantidadeCampos * 6 + quantidadeListas * 5);

    doc.setDrawColor(230, 230, 230);
    doc.line(margem, y, larguraPagina - margem, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(bloco.titulo, margem, y);
    y += 5;

    bloco.campos?.forEach((campo) => {
      escreverRotuloValor(campo.rotulo, normalizarTexto(campo.valor));
    });

    bloco.listas?.forEach((lista) => {
      garantirEspaco(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 45);
      doc.text(lista.titulo, margem, y);
      y += 5;

      lista.itens.forEach((item) => {
        escreverTexto(`• ${item}`, 10, 70);
      });
    });

    y += 2;
  });

  garantirEspaco(28);
  doc.setDrawColor(230, 230, 230);
  doc.line(margem, y, larguraPagina - margem, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Totais", margem, y);
  y += 5;

  escreverRotuloValor("Coreografias", formatarMoeda(totais.coreografias));
  if ((totais.profissionaisExtras ?? 0) > 0) {
    escreverRotuloValor(
      "Profissionais extras",
      formatarMoeda(totais.profissionaisExtras ?? 0),
    );
  }
  escreverRotuloValor("Total", formatarMoeda(totais.total));

  doc.save(nomeArquivo);
}
