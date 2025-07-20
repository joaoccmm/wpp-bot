const iniciarBot = require("./bot/whatsapp");
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
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WhatsApp Chatbot está rodando! Status: " + JSON.stringify(appStatus, null, 2));
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
