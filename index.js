const { iniciarBot, getCurrentQR, getQRUrl } = require("./bot/whatsapp");
const { inicializarPlanilha } = require("./google/sheets");
const http = require("http");

// Configuração para Railway
const PORT = process.env.PORT || 3000;

// Estado da aplicação
let appStatus = {
  server: false,
  sheets: false,
  bot: false,
  errors: []
};

// Criar servidor HTTP para health check
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
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
        components: appStatus
      })
    );
  } else if (req.url === "/qr") {
    // Endpoint para visualizar QR Code
    const qr = getCurrentQR();
    const qrUrl = getQRUrl();
    
    if (!qr && !qrUrl) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WhatsApp QR Code</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .status { color: green; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>🔗 WhatsApp Bot</h1>
          <div class="status">✅ Bot já conectado ou QR não disponível</div>
          <p>O bot já está conectado ao WhatsApp ou não há QR code no momento.</p>
          <p><a href="/health">Ver Status</a></p>
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
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .qr-container { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .qr-ascii { font-family: monospace; font-size: 12px; line-height: 1; white-space: pre; }
            .url { background: #e8f4fd; padding: 10px; border-radius: 5px; margin: 20px 0; word-break: break-all; }
            .refresh { background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          </style>
          <script>
            setTimeout(() => location.reload(), 30000); // Auto refresh em 30s
          </script>
        </head>
        <body>
          <h1>📱 WhatsApp QR Code</h1>
          <p>Escaneie este QR code com seu WhatsApp</p>
          
          ${qrUrl ? `
            <div class="url">
              <strong>🔗 URL do QR:</strong><br>
              <a href="${qrUrl}" target="_blank">${qrUrl}</a>
            </div>
          ` : ''}
          
          ${qr ? `
            <div class="qr-container">
              <div class="qr-ascii">${qr}</div>
            </div>
          ` : ''}
          
          <p>
            <a href="/qr" class="refresh">🔄 Atualizar</a>
            <a href="/health" class="refresh">📊 Status</a>
          </p>
          
          <p><small>Esta página será atualizada automaticamente em 30 segundos</small></p>
        </body>
        </html>
      `);
    }
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WhatsApp Chatbot está rodando! Status: " + JSON.stringify(appStatus, null, 2) + "\n\nAcesse /qr para ver o QR Code\nAcesse /health para ver o status");
  }
});

// Inicializar aplicação
(async () => {
  try {
    // Iniciar servidor HTTP PRIMEIRO
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
      appStatus.server = true;
    });

    // Aguardar um pouco para garantir que o servidor está rodando
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Inicializar Google Sheets (com timeout)
    console.log("⏳ Inicializando Google Sheets...");
    try {
      await Promise.race([
        inicializarPlanilha(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout Google Sheets')), 30000))
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
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout WhatsApp Bot')), 60000))
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
