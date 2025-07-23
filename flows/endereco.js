const { getEstado, setEstado } = require("../utils/estados");
const { protecao } = require("../utils/protecaoAntiBot");

// Função helper para envio seguro de mensagens
async function enviarMensagemSeguraEndereco(client, id, mensagem, tipo = 'normal') {
  await protecao.delayInteligente(tipo, id, { 
    client, 
    chatId: id, 
    mensagemLonga: mensagem.length > 50 
  });
  
  await protecao.simularDigitando(client, id);
  const mensagemVariada = protecao.adicionarVariacaoNatural(mensagem);
  await client.sendText(id, mensagemVariada);
  protecao.registrarAtividade(id);
}

const mensagensEndereco = {
  cep: "6️⃣ Informe seu *CEP* (somente números):",
  rua: "7️⃣ Informe o *nome da rua* ou *logradouro*:",
  numero: "8️⃣ Informe o *número* da residência:",
  complemento: "9️⃣ Informe o *complemento* (ou digite 'nenhum'):",
  bairro: "🔟 Informe o *bairro*:",
  confirmacao: (estado) =>
    `📦 *Confirmação de Endereço*\n\n` +
    `*CEP:* ${estado.cep}\n` +
    `*Rua:* ${estado.rua}, Nº ${estado.numero}\n` +
    `*Complemento:* ${estado.complemento}\n` +
    `*Bairro:* ${estado.bairro}\n\n` +
    `Essas informações estão corretas?\n\n✅ *Sim*  |  ❌ *Não*`,
};

async function fluxoEndereco(client, msg) {
  const id = msg.from;
  const userMessage = (msg.body || "").trim();
  let estado = getEstado(id);

  if (!estado || estado.etapa !== "endereco") return;

  if (!estado.etapaEndereco) {
    estado.etapaEndereco = "cep";
    setEstado(id, estado);
    await enviarMensagemSeguraEndereco(client, id, mensagensEndereco.cep, 'transicao_etapa');
    return;
  }

  switch (estado.etapaEndereco) {
    case "cep":
      if (!/^\d{8}$/.test(userMessage)) {
        await client.sendText(
          id,
          "❌ CEP inválido. Envie os 8 dígitos do CEP."
        );
        return;
      }
      estado.cep = userMessage;
      estado.etapaEndereco = "rua";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.rua);
      break;

    case "rua":
      estado.rua = userMessage;
      estado.etapaEndereco = "numero";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.numero);
      break;

    case "numero":
      estado.numero = userMessage;
      estado.etapaEndereco = "complemento";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.complemento);
      break;

    case "complemento":
      estado.complemento = userMessage === "" ? "nenhum" : userMessage;
      estado.etapaEndereco = "bairro";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.bairro);
      break;

    case "bairro":
      estado.bairro = userMessage;
      estado.etapaEndereco = "confirmarEndereco";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.confirmacao(estado));
      break;

    case "confirmarEndereco":
      if (/^(sim|✅)$/i.test(userMessage)) {
        try {
          console.log(
            "✅ Endereço confirmado, avançando para o fluxo de perguntas"
          );

          estado.etapaEndereco = null;
          estado.etapa = "perguntas";
          estado.etapa3 = "inicio";
          setEstado(id, estado);

          // A mensagem introdutória será enviada automaticamente pelo fluxoPerguntas
          // junto com a primeira pergunta - não precisa enviar aqui
          const { fluxoPerguntas } = require("./fluxoPerguntas");
          await fluxoPerguntas(client, { ...msg, body: "" });
        } catch (e) {
          console.error("Erro ao confirmar endereço:", e);
          await client.sendText(
            id,
            "❌ Ocorreu um erro. Por favor, tente novamente."
          );
        }
      } else if (/^(não|nao|❌)$/i.test(userMessage)) {
        await client.sendText(
          id,
          "🔁 Vamos reiniciar o preenchimento do endereço."
        );
        estado.etapaEndereco = "cep";
        setEstado(id, estado);
        await client.sendText(id, mensagensEndereco.cep);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com ✅ *Sim* se os dados estiverem corretos ou ❌ *Não* para corrigir."
        );
      }
      break;

    default:
      await client.sendText(id, "Ops! Não entendi sua resposta.");
      break;
  }
}

module.exports = fluxoEndereco;
