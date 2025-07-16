const venom = require("venom-bot");
const fluxoCadastro = require("../flows/cadastro");
const fluxoEndereco = require("../flows/endereco");
const { fluxoPerguntas } = require("../flows/fluxoPerguntas");
const { getEstado } = require("../utils/estados");

async function iniciarBot() {
  const client = await venom.create({
    session: "chatbot-wpp",
    multidevice: true,
    disableSpins: true,
    headless: true,
    browserArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-extensions",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
    logQR: true,
    autoClose: false,
  });

  client.onMessage(async (msg) => {
    try {
      if (msg.isGroupMsg) return;

      // Verificar se a mensagem tem body válido
      if (!msg.body && msg.body !== "") {
        console.log("Mensagem sem body recebida, ignorando...");
        return;
      }

      const estado = getEstado(msg.from);

      if (!estado) {
        await fluxoCadastro(client, msg);
        return;
      }

      if (estado.etapa === "endereco") {
        await fluxoEndereco(client, msg);
      } else if (estado.etapa === "perguntas") {
        // <-- CORRIGIDO
        await fluxoPerguntas(client, msg);
      } else {
        await fluxoCadastro(client, msg);
      }
    } catch (err) {
      console.error("Erro no processamento da mensagem:", err);
    }
  });

  console.log("Bot iniciado com sucesso!");
}

module.exports = iniciarBot;
