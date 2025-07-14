const { getEstado, setEstado, limparEstado } = require("../utils/estados");

const mensagensPerguntas = {
  inicio:
    "🤔 Agora vamos fazer algumas perguntas finais para concluir seu cadastro.",
  pergunta1:
    "❓ Você já participou de algum processo para imigração anteriormente? (Sim ou Não)",
  pergunta2:
    "🗓️ Você tem disponibilidade para viajar nos próximos 6 meses? (Sim ou Não)",
  final:
    "✅ Obrigado! Suas informações foram registradas com sucesso.\n\nEntraremos em contato em breve com os próximos passos. ✈️",
};

async function fluxoPerguntas(client, msg) {
  const id = msg.from;
  const userMessage = msg.body.trim().toLowerCase();
  let estado = getEstado(id);

  if (!estado || estado.etapa3 !== "inicio") return;

  if (!estado.pergunta1) {
    estado.pergunta1 = userMessage;
    estado.etapa3 = "pergunta2";
    setEstado(id, estado);
    await client.sendText(id, mensagensPerguntas.pergunta2);
    return;
  }

  if (!estado.pergunta2) {
    estado.pergunta2 = userMessage;
    estado.etapa3 = "finalizado";
    setEstado(id, estado);
    await client.sendText(id, mensagensPerguntas.final);
    limparEstado(id); // zera tudo ao final
  }
}

module.exports = fluxoPerguntas;
