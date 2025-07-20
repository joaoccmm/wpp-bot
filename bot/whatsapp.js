const venom = require("venom-bot");
const fluxoCadastro = require("../flows/cadastro");
const fluxoEndereco = require("../flows/endereco");
const { fluxoPerguntas } = require("../flows/fluxoPerguntas");
const { getEstado } = require("../utils/estados");

// Variável global para armazenar o QR code
let currentQRCode = null;
let qrCodeUrl = null;

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
    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
      console.log("📱 QR CODE GERADO!");
      console.log("═".repeat(50));
      console.log("🔗 URL do QR Code:", urlCode);
      console.log("📱 Tentativa:", attempts);
      console.log("═".repeat(50));
      
      // Armazenar para endpoint web
      currentQRCode = asciiQR;
      qrCodeUrl = urlCode;
      
      // Tentar exibir o QR de forma mais legível
      if (asciiQR) {
        console.log("QR CODE ASCII:");
        console.log(asciiQR.replace(/\n/g, '\n'));
      }
      
      console.log("═".repeat(50));
      console.log("💡 DICAS:");
      console.log("1. Acesse /qr no navegador para ver o QR Code");
      console.log("2. Use a URL acima para gerar o QR em sites online");
      console.log("3. Escaneie com o WhatsApp Web");
      console.log("═".repeat(50));
    },
    
    // Status da conexão
    statusFind: (statusSession, session) => {
      console.log("📊 Status da sessão:", statusSession, "| Sessão:", session);
      
      if (statusSession === 'qrReadSuccess') {
        console.log("✅ QR Code escaneado com sucesso!");
        currentQRCode = null;
        qrCodeUrl = null;
      }
      
      if (statusSession === 'autocloseCalled') {
        console.log("🔄 Sessão fechada automaticamente");
      }
      
      if (statusSession === 'notLogged') {
        console.log("❌ Não logado - QR Code necessário");
      }
      
      if (statusSession === 'browserClose') {
        console.log("🌐 Browser fechado");
      }
    }
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

module.exports = { 
  iniciarBot, 
  getCurrentQR, 
  getQRUrl 
};
