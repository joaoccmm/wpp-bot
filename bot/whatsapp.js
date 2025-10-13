const venom = require("venom-bot");
const QRCode = require("qrcode");
const fluxoCadastro = require("../flows/cadastro");
const fluxoEndereco = require("../flows/endereco");
const { fluxoPerguntas } = require("../flows/fluxoPerguntas");
const { getEstado, limparEstado } = require("../utils/estados");

// Variáveis globais para armazenar o QR code
let currentQRCode = null;
let qrCodeUrl = null;
let qrCodeImage = null; // Base64 da imagem do QR

async function iniciarBot() {
  console.log("🚀 Iniciando Venom Bot...");

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
      "--no-first-run",
      "--disable-default-apps",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
    logQR: false, // Desabilitamos o log padrão
    autoClose: false,

    // Callback personalizado para QR Code
    catchQR: async (base64Qr, asciiQR, attempts, urlCode) => {
      console.log("📱 QR CODE GERADO!");
      console.log("═".repeat(50));
      console.log("� Tentativa:", attempts);

      // Processar URL (encurtar se muito grande)
      let processedUrl = urlCode;
      if (urlCode && urlCode.length > 100) {
        // Se a URL for muito grande, usar apenas uma parte
        console.log("⚠️  URL muito longa, usando dados base64 direto");
        processedUrl = "URL muito longa - veja QR code na interface web";
      } else if (urlCode) {
        console.log("🔗 URL do QR Code:", urlCode);
      }

      console.log("═".repeat(50));

      // Armazenar para endpoint web
      currentQRCode = asciiQR;
      qrCodeUrl = processedUrl;
      qrCodeImage = base64Qr; // Usar a imagem base64 diretamente

      // Tentar gerar QR code como imagem se temos dados válidos
      try {
        if (urlCode && urlCode.length < 2000) {
          // Limite seguro para QR
          const qrDataUrl = await QRCode.toDataURL(urlCode, {
            width: 400,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          qrCodeImage = qrDataUrl;
          console.log("✅ QR Code gerado como imagem");
        } else if (base64Qr) {
          // Usar o base64 que o venom já gerou
          qrCodeImage = `data:image/png;base64,${base64Qr}`;
          console.log("✅ Usando QR Code do Venom");
        }
      } catch (error) {
        console.log("⚠️  Erro ao gerar QR como imagem:", error.message);
        qrCodeImage = base64Qr ? `data:image/png;base64,${base64Qr}` : null;
      }

      // Exibir QR ASCII (limitado para não quebrar terminal)
      if (asciiQR && asciiQR.length < 2000) {
        console.log("QR CODE ASCII:");
        console.log(
          asciiQR.substring(0, 1000) + (asciiQR.length > 1000 ? "..." : "")
        );
      }

      console.log("═".repeat(50));
      console.log("💡 COMO CONECTAR:");
      console.log("1. 🌐 Acesse /qr no seu navegador");
      console.log("2. 📱 Escaneie o QR Code com WhatsApp");
      console.log("3. 🔄 A página atualiza automaticamente");
      console.log("═".repeat(50));
    },

    // Status da conexão
    statusFind: (statusSession, session) => {
      console.log("📊 Status da sessão:", statusSession, "| Sessão:", session);

      if (statusSession === "qrReadSuccess") {
        console.log("✅ QR Code escaneado com sucesso!");
        currentQRCode = null;
        qrCodeUrl = null;
      }

      if (statusSession === "autocloseCalled") {
        console.log("🔄 Sessão fechada automaticamente");
      }

      if (statusSession === "notLogged") {
        console.log("❌ Não logado - QR Code necessário");
      }

      if (statusSession === "browserClose") {
        console.log("🌐 Browser fechado");
      }
    },
  });

  client.onMessage(async (msg) => {
    try {
      if (msg.isGroupMsg) return;

      // Verificar se a mensagem tem body válido
      if (!msg.body && msg.body !== "") {
        console.log("Mensagem sem body recebida, ignorando...");
        return;
      }

      const id = msg.from;
      const userMessage = msg.body.toLowerCase().trim();

      // Log para debug
      console.log(`📨 Mensagem recebida de ${id}: "${msg.body}"`);
      console.log(`🔄 Processando como: "${userMessage}"`);

      // 🚫 COMANDO CANCELAR - Funciona em qualquer estágio
      if (userMessage === "cancelar" || userMessage === "cancelar.") {
        const estadoAtual = getEstado(id);

        if (estadoAtual) {
          limparEstado(id);
          console.log(`❌ Conversa cancelada pelo usuário: ${id}`);

          await client.sendText(
            id,
            "❌ *Conversa cancelada!*\n\n" +
              "Todos os dados foram apagados.\n" +
              "Digite qualquer mensagem para começar um novo cadastro.\n\n" +
              "💡 _Dica: Digite 'cancelar' a qualquer momento para encerrar._"
          );
        } else {
          await client.sendText(
            id,
            "ℹ️ Não há conversa ativa para cancelar.\n\n" +
              "Digite qualquer mensagem para começar um cadastro."
          );
        }
        return;
      }

      const estado = getEstado(id);

      // Permitir apenas o número autorizado iniciar o fluxo
      const numeroAutorizado = "553384123027@c.us";

      if (id !== numeroAutorizado) {
        await client.sendText(
          id,
          "⚠️ Este número não está autorizado a iniciar o atendimento."
        );
        return;
      }

      // Só inicia o fluxo se o comando for enviado pelo número autorizado
      if (!estado) {
        if (
          ["iniciar", "começar", "comecar", "bot", "start"].includes(
            userMessage
          )
        ) {
          await fluxoCadastro(client, msg);
        } else {
          await client.sendText(
            id,
            "🤖 Para iniciar o atendimento, digite *iniciar* ou *começar*."
          );
        }
        return;
      }

      if (estado.etapa === "endereco") {
        await fluxoEndereco(client, msg);
      } else if (estado.etapa === "perguntas") {
        await fluxoPerguntas(client, msg);
      } else {
        await fluxoCadastro(client, msg);
      }
    } catch (err) {
      console.error("❌ Erro no processamento da mensagem:", err);
      console.error("📋 Detalhes da mensagem:", {
        from: msg.from,
        body: msg.body,
        isGroupMsg: msg.isGroupMsg,
        timestamp: new Date().toISOString(),
      });

      // Em caso de erro, também oferecer opção de cancelar
      try {
        await client.sendText(
          msg.from,
          "❌ *Erro no processamento*\n\n" +
            "Ocorreu um erro inesperado.\n" +
            "Digite *cancelar* para reiniciar ou tente novamente."
        );
      } catch (sendError) {
        console.error("❌ Erro ao enviar mensagem de erro:", sendError);
      }
    }
  });

  console.log("✅ Bot WhatsApp configurado e pronto!");
  return client;
}

// Funções para acessar QR code externamente
function getCurrentQR() {
  return currentQRCode;
}

function getQRUrl() {
  return qrCodeUrl;
}

function getQRImage() {
  return qrCodeImage;
}

function clearQRData() {
  currentQRCode = null;
  qrCodeUrl = null;
  qrCodeImage = null;
}

module.exports = {
  iniciarBot,
  getCurrentQR,
  getQRUrl,
  getQRImage,
  clearQRData,
};
