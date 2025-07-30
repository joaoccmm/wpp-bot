// Teste da mensagem unificada de saudação
const fluxoCadastro = require("./flows/cadastro");

console.log("🧪 Testando mensagem unificada de saudação...");

// Simular client mockado
const mockClient = {
  sendText: (id, message) => {
    console.log(`\n📤 Mensagem enviada para ${id}:`);
    console.log("📝 Conteúdo:", message);
    console.log("📏 Tamanho:", message.length, "caracteres");

    // Verificar se contém saudação e pergunta
    const contemSaudacao =
      message.includes("Olá!") && message.includes("assistente virtual");
    const contemPergunta =
      message.includes("Vamos começar?") && message.includes("Sim ou Não");

    console.log("✅ Contém saudação:", contemSaudacao);
    console.log("✅ Contém pergunta:", contemPergunta);
    console.log("🎯 Mensagem unificada:", contemSaudacao && contemPergunta);

    return Promise.resolve();
  },
};

// Simular mensagem inicial (usuário novo)
const mockMsg = {
  from: "5511999999999@c.us",
  body: "oi",
};

async function testarMensagemUnificada() {
  try {
    console.log("🚀 Simulando primeiro contato do usuário...");
    await fluxoCadastro(mockClient, mockMsg);
    console.log("\n✅ Teste concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

testarMensagemUnificada();
