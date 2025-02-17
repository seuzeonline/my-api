import fetch from 'node-fetch';

export default async function handler(req, res) {
  const nomeServidor = req.query.nome_servidor;

  if (!nomeServidor) {
    return res.status(400).json({ error: "Nome do servidor é obrigatório" });
  }

  const url = "https://api.imap.org.br/api/DespesaPessoal?cod_orgao_org=1784";
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { "accept": "text/plain" },
      timeout: 10000, // Limita o tempo da requisição para 10 segundos
    });

    const data = await response.json();

    const servidoresFiltrados = data.filter(servidor =>
      servidor.des_nome_servidor_sa2.toLowerCase().includes(nomeServidor.toLowerCase())
    );

    if (Date.now() - startTime > 10000) {
      return res.status(408).json({ error: "A consulta excedeu o tempo limite de 10 segundos" });
    }

    return res.status(200).json({ servidores: servidoresFiltrados });

  } catch (error) {
    if (error.type === 'request-timeout') {
      return res.status(408).json({ error: "A requisição excedeu o tempo de espera" });
    }
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
}
