const venom = require("venom-bot");
const fluxoCadastro = require("../flows/cadastro");
const fluxoEndereco = require("../flows/endereco");
const { getEstado } = require("../utils/estados");

async function iniciarBot() {
  try {
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

        const estado = getEstado(msg.from);

        if (!estado || estado.etapa) {
          await fluxoCadastro(client, msg);
        } else if (estado.etapaEndereco) {
          await fluxoEndereco(client, msg);
        }
      } catch (erro) {
        console.error("Erro no processamento da mensagem:", erro);
      }
    });

    console.log("✅ Bot iniciado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao iniciar o bot:", error);
    process.exit(1);
  }
}

module.exports = iniciarBot;
