const iniciarBot = require("./bot/whatsapp");
const { inicializarPlanilha } = require("./google/sheets");
const http = require("http");

// Configuração para Railway
const PORT = process.env.PORT || 3000;

// Criar servidor HTTP para health check
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "WhatsApp Chatbot",
      })
    );
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WhatsApp Chatbot está rodando!");
  }
});

// Inicializar aplicação
(async () => {
  try {
    // Iniciar servidor HTTP
    server.listen(PORT, () => {
      console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
    });

    // Inicializar serviços
    console.log("⏳ Aguardando configuração das credenciais Google...");
    
    // Temporariamente comentado até configurar credenciais
    // await inicializarPlanilha();
    // await iniciarBot();
    
    console.log("✅ Servidor HTTP iniciado. Configure GOOGLE_CREDENTIALS para ativar o bot.");
  } catch (error) {
    console.error("❌ Falha na inicialização:", error);
    process.exit(1);
  }
})();
