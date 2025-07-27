// Teste específico para debugging do problema de travamento
const { fluxoPerguntas } = require("./flows/fluxoPerguntas");
const { setEstado, getEstado } = require("./utils/estados");

// Mock do client para simular WhatsApp com possíveis erros
const mockClient = {
  sendText: async (id, message) => {
    console.log(`📤 MOCK: Enviando para ${id}: ${message.substring(0, 50)}...`);

    // Simular delay como no WhatsApp real
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simular possível erro intermitente
    if (Math.random() < 0.1) {
      // 10% chance de erro
      throw new Error("Simulated WhatsApp API error");
    }

    return Promise.resolve();
  },

  startTyping: async (id) => {
    console.log(`⌨️ MOCK: Iniciando digitação para ${id}`);
    return Promise.resolve();
  },

  stopTyping: async (id) => {
    console.log(`⌨️ MOCK: Parando digitação para ${id}`);
    return Promise.resolve();
  },
};

// Simular cenário onde trava
async function testarCenarioTravamento() {
  console.log("🧪 Testando cenário onde o bot trava...\n");

  const userId = "teste_" + Date.now();

  // 1. Configurar estado inicial (usuário chegou na etapa de perguntas)
  console.log("1️⃣ Configurando estado inicial...");
  setEstado(userId, {
    etapa: "perguntas",
    etapa3: "menoridade",
    nome: "João Teste",
    cpf: "12345678900",
    // ... outros campos necessários
  });

  // 2. Simular mensagem "não" para menor de idade
  console.log('2️⃣ Simulando resposta "não" para menor de idade...');
  const msgNao = {
    from: userId,
    body: "não",
  };

  try {
    console.log("📥 Processando mensagem...");
    await fluxoPerguntas(mockClient, msgNao);
    console.log("✅ Processamento concluído com sucesso!");

    // Verificar estado após processamento
    const estadoFinal = getEstado(userId);
    console.log("📊 Estado final:", {
      etapa: estadoFinal.etapa,
      etapa3: estadoFinal.etapa3,
      menorIdade: estadoFinal.menorIdade,
    });
  } catch (error) {
    console.error("❌ ERRO DETECTADO:");
    console.error("   Mensagem:", error.message);
    console.error("   Stack:", error.stack);
  }
}

// Executar teste
console.log("🚀 Iniciando teste de debug...\n");
testarCenarioTravamento()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Teste falhou:", error);
    process.exit(1);
  });
