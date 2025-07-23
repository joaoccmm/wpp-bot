const {
  iniciarBot,
  getCurrentQR,
  getQRUrl,
  getQRImage,
  clearQRData,
} = require("./bot/whatsapp");
const { inicializarPlanilha } = require("./google/sheets");
const { inicializarProtecoes, gerarRelatorioAtividade } = require("./config/seguranca");
const http = require("http");

// Configuração para Railway e outros serviços de cloud
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

console.log(`🚀 Configuração de servidor:`);
console.log(`   PORT: ${PORT}`);
console.log(`   HOST: ${HOST}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(`   RAILWAY: ${process.env.RAILWAY_ENVIRONMENT ? '✅' : '❌'}`);

// Inicializar sistema de proteção anti-banimento
inicializarProtecoes();

// Estado da aplicação
let appStatus = {
  server: false,
  sheets: false,
  bot: false,
  errors: [],
  port: PORT,
  host: HOST,
};

// Criar servidor HTTP para health check
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "WhatsApp Chatbot",
        components: appStatus,
        environment: {
          port: PORT,
          host: HOST,
          railway_url: process.env.RAILWAY_STATIC_URL || "not set",
        },
      })
    );
  } else if (req.url === "/ping" || req.url === "/test") {
    // Endpoint simples para testar se o servidor está funcionando
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      `PONG - Servidor funcionando!\nTimestamp: ${new Date().toISOString()}\nPORT: ${PORT}\nHOST: ${HOST}`
    );
  } else if (req.url === "/seguranca" || req.url === "/security") {
    // Endpoint para monitorar proteções anti-bot
    res.writeHead(200, { "Content-Type": "application/json" });
    const relatorio = gerarRelatorioAtividade();
    res.end(JSON.stringify(relatorio, null, 2));
  } else if (req.url === "/qr") {
    // Endpoint para visualizar QR Code
    const qr = getCurrentQR();
    const qrUrl = getQRUrl();
    const qrImage = getQRImage();

    if (!qr && !qrUrl && !qrImage) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WhatsApp QR Code</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 20px; background: #f0f2f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .status { color: #00a884; font-weight: bold; font-size: 18px; margin: 20px 0; }
            .icon { font-size: 48px; margin: 20px 0; }
            a { color: #00a884; text-decoration: none; padding: 10px 20px; background: #e7f3ff; border-radius: 8px; display: inline-block; margin: 10px; }
            a:hover { background: #d0ebff; }
          </style>
          <script>
            setTimeout(() => location.reload(), 10000); // Refresh mais rápido
          </script>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>WhatsApp Bot</h1>
            <div class="status">Bot já conectado!</div>
            <p>O bot já está conectado ao WhatsApp ou não há QR code disponível no momento.</p>
            <p>
              <a href="/health">📊 Ver Status</a>
              <a href="/qr">🔄 Atualizar</a>
            </p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WhatsApp QR Code</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 20px; background: #f0f2f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .qr-container { background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0; }
            .qr-image { max-width: 300px; height: auto; border-radius: 10px; }
            .qr-ascii { font-family: 'Courier New', monospace; font-size: 8px; line-height: 0.8; white-space: pre; background: #000; color: #fff; padding: 10px; border-radius: 5px; overflow: hidden; }
            .instructions { background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left; }
            .refresh { background: #00a884; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px; display: inline-block; font-weight: bold; }
            .refresh:hover { background: #008c6f; }
            .url-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; }
            .countdown { color: #666; font-size: 12px; margin-top: 20px; }
          </style>
          <script>
            let countdown = 15;
            const countdownEl = document.getElementById('countdown');
            
            function updateCountdown() {
              if (countdownEl) {
                countdownEl.textContent = countdown;
                countdown--;
                if (countdown < 0) {
                  location.reload();
                }
              }
            }
            
            setInterval(updateCountdown, 1000);
            setTimeout(() => location.reload(), 15000);
          </script>
        </head>
        <body>
          <div class="container">
            <h1>📱 Conectar WhatsApp</h1>
            <p>Escaneie este QR code com seu WhatsApp</p>
            
            <div class="instructions">
              <h3>📋 Como conectar:</h3>
              <ol style="text-align: left;">
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em <strong>Mais opções</strong> (⋮) > <strong>Dispositivos conectados</strong></li>
                <li>Toque em <strong>Conectar um dispositivo</strong></li>
                <li>Aponte seu celular para esta tela para escanear o código</li>
              </ol>
            </div>
            
            ${
              qrImage
                ? `
              <div class="qr-container">
                <img src="${qrImage}" alt="QR Code" class="qr-image">
              </div>
            `
                : ""
            }
            
            ${
              qrUrl &&
              qrUrl !== "URL muito longa - veja QR code na interface web" &&
              qrUrl.length < 200
                ? `
              <div class="url-info">
                <strong>🔗 URL alternativa:</strong><br>
                <small style="word-break: break-all;">${qrUrl}</small>
              </div>
            `
                : ""
            }
            
            ${
              qr && !qrImage
                ? `
              <div class="qr-container">
                <div class="qr-ascii">${
                  qr.length > 1000 ? qr.substring(0, 1000) + "..." : qr
                }</div>
              </div>
            `
                : ""
            }
            
            <p>
              <a href="/qr" class="refresh">🔄 Atualizar QR</a>
              <a href="/health" class="refresh" style="background: #6c757d;">📊 Status</a>
            </p>
            
            <p class="countdown">Atualização automática em <span id="countdown">15</span> segundos</p>
          </div>
        </body>
        </html>
      `);
    }
  } else if (req.url === "/debug-credentials") {
    // Endpoint para debugar credenciais Google
    res.writeHead(200, { "Content-Type": "text/plain" });

    let debugOutput = "🔍 Debug Credenciais Google\n";
    debugOutput += "=".repeat(40) + "\n\n";

    // Verificar variável de ambiente
    debugOutput += "1. Variável GOOGLE_CREDENTIALS:\n";
    debugOutput += `   Existe: ${!!process.env.GOOGLE_CREDENTIALS}\n`;
    debugOutput += `   Tipo: ${typeof process.env.GOOGLE_CREDENTIALS}\n`;

    if (process.env.GOOGLE_CREDENTIALS) {
      debugOutput += `   Tamanho: ${process.env.GOOGLE_CREDENTIALS.length} chars\n`;
      debugOutput += `   Primeiros 100 chars: ${process.env.GOOGLE_CREDENTIALS.substring(
        0,
        100
      )}\n`;
      debugOutput += `   Últimos 50 chars: ${process.env.GOOGLE_CREDENTIALS.slice(
        -50
      )}\n`;

      try {
        const parsed = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        debugOutput += "\n2. ✅ JSON parseado com sucesso!\n";
        debugOutput += `   Campos: ${Object.keys(parsed).join(", ")}\n`;
        debugOutput += `   project_id: ${parsed.project_id}\n`;
        debugOutput += `   client_email: ${parsed.client_email}\n`;
        debugOutput += `   private_key existe: ${!!parsed.private_key}\n`;
      } catch (error) {
        debugOutput += `\n2. ❌ Erro no parse JSON: ${error.message}\n`;
      }
    } else {
      debugOutput += "   ❌ Variável não encontrada!\n";
    }

    // Verificar todas as vars que contenham GOOGLE
    debugOutput += "\n3. Todas as variáveis relacionadas:\n";
    Object.keys(process.env).forEach((key) => {
      if (key.toUpperCase().includes("GOOGLE")) {
        debugOutput += `   ${key}: ${process.env[key] ? "EXISTE" : "VAZIO"}\n`;
      }
    });

    debugOutput += "\n" + "=".repeat(40) + "\n";
    debugOutput += new Date().toISOString();

    res.end(debugOutput);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      "WhatsApp Chatbot está rodando! Status: " +
        JSON.stringify(appStatus, null, 2) +
        "\n\nAcesse /qr para ver o QR Code\nAcesse /health para ver o status\nAcesse /debug-credentials para debug"
    );
  }
});

// Inicializar aplicação
(async () => {
  try {
    // Iniciar servidor HTTP PRIMEIRO
    server.listen(PORT, HOST, () => {
      console.log(`🌐 Servidor HTTP rodando em ${HOST}:${PORT}`);
      console.log(`📡 Acesse: http://localhost:${PORT}`);
      if (process.env.RAILWAY_STATIC_URL) {
        console.log(`🚀 Railway URL: ${process.env.RAILWAY_STATIC_URL}`);
      }
      appStatus.server = true;
    });

    // Adicionar handlers de erro para o servidor
    server.on("error", (err) => {
      console.error(`❌ Erro no servidor HTTP:`, err);
      appStatus.errors.push(`Server: ${err.message}`);
    });

    // Aguardar um pouco para garantir que o servidor está rodando
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Inicializar Google Sheets (com timeout)
    console.log("⏳ Inicializando Google Sheets...");
    try {
      await Promise.race([
        inicializarPlanilha(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout Google Sheets")), 30000)
        ),
      ]);
      appStatus.sheets = true;
      console.log("✅ Google Sheets inicializado");
    } catch (error) {
      console.error("❌ Erro no Google Sheets:", error.message);
      appStatus.errors.push(`Google Sheets: ${error.message}`);
    }

    // Inicializar WhatsApp Bot (com timeout)
    console.log("⏳ Inicializando WhatsApp Bot...");
    try {
      await Promise.race([
        iniciarBot(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout WhatsApp Bot")), 60000)
        ),
      ]);
      appStatus.bot = true;
      console.log("✅ Bot WhatsApp iniciado com sucesso!");
    } catch (error) {
      console.error("❌ Erro no WhatsApp Bot:", error.message);
      appStatus.errors.push(`WhatsApp Bot: ${error.message}`);
    }

    console.log("🚀 Aplicação inicializada. Status:", appStatus);
  } catch (error) {
    console.error("❌ Falha crítica na inicialização:", error);
    appStatus.errors.push(`Inicialização crítica: ${error.message}`);

    // Não fazer exit se o servidor HTTP estiver funcionando
    if (!appStatus.server) {
      process.exit(1);
    }
  }
})();
