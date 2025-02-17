export default async function handler(req, res) {
  const nomeServidor = req.query.nome_servidor;

  if (!nomeServidor) {
    return res.status(400).json({ error: "Nome do servidor é obrigatório" });
  }

  const url = "https://api.imap.org.br/api/DespesaPessoal?cod_orgao_org=1784";

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { "accept": "text/plain" }
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao buscar dados da API externa" });
    }

    const data = await response.json();

    const servidoresFiltrados = data.filter(servidor =>
      servidor.des_nome_servidor_sa2.toLowerCase().includes(nomeServidor.toLowerCase())
    );

    return res.status(200).json({ servidores: servidoresFiltrados });

  } catch (error) {
    return res.status(500).json({ error: `Erro interno: ${error.message}` });
  }
}
