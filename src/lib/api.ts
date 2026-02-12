const API_URL = "https://competeart-api-production.up.railway.app/";

export async function criarEscola(dados: any) {
  const response = await fetch(`${API_URL}/escolas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar escola");
  }

  return response.json();
}
export async function criarBailarino(
  escolaId: string,
  dados: {
    nomeCompleto: string;
    nomeArtistico: string;
    cpf: string;
    dataNascimento: string;
  },
) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/bailarinos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar bailarino");
  }

  return response.json();
}
export async function listarBailarinos(escolaId: string) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/bailarinos`);

  if (!response.ok) {
    throw new Error("Erro ao carregar bailarinos");
  }

  return response.json();
}
export async function criarCoreografia(escolaId: string, dados: any) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/coreografias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar coreografia");
  }

  return response.json();
}

export async function obterResumo(escolaId: string) {
  const response = await fetch(`${API_URL}/escolas/${escolaId}/resumo`);

  if (!response.ok) {
    throw new Error("Erro ao carregar resumo");
  }

  return response.json();
}
