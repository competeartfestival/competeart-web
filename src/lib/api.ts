const API_URL = import.meta.env.VITE_API_URL;

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
export async function listarEscolasAdmin() {
  const token = localStorage.getItem("admin-token");

  if (!token) {
    throw new Error("NAO_AUTENTICADO");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/escolas`,
    {
      headers: {
        "x-admin-key": token,
      },
    },
  );
  if (response.status === 401) {
    localStorage.removeItem("admin-token");
    window.location.href = "/admin/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Erro ao carregar escolas");
  }

  return response.json();
}
export async function validarAdmin(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/escolas`,
    {
      headers: {
        "x-admin-key": token,
      },
    },
  );

  return response.ok;
}
export async function buscarEscolaAdmin(id: string) {
  const token = localStorage.getItem("admin-token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/escolas/${id}`,
    {
      headers: {
        "x-admin-key": token || "",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar escola");
  }

  return response.json();
}
