// Teste da nova funcionalidade de salvamento direto
const { setEstado, getEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas");

// Mock do cliente para teste
const mockClient = {
  sendText: async (id, message) => {
    console.log(`📱 Mensagem enviada para ${id}: ${message}`);
  },
};

// Mock da mensagem para simular pergunta 14 com resposta "Não"
const mockMsg = {
  from: "test123@whatsapp",
  body: "Não",
};

async function testarSalvamentoDireto() {
  try {
    console.log("🧪 Testando salvamento direto...");

    // Criar estado simulado até pergunta 14
    const estadoSimulado = {
      nome: "João Teste Direto",
      nascimento: "15/05/1990",
      cpf: "12345678900",
      telefone: "11999887766",
      email: "joao.direto@email.com",
      cep: "01000000",
      rua: "Rua Teste Direto",
      numero: "123",
      bairro: "Centro",
      complemento: "Apto 45",
      etapa: "perguntas",
      etapa3: "pergunta14", // Simular que está na pergunta 14
      menorIdade: "Não",
      pergunta1: "Sim",
      pergunta2: "Não",
      pergunta3: "Sim",
      pergunta5: "Sim",
      pergunta6: "a,b",
      pergunta7: "Diagnóstico teste - 01/01/2020",
      pergunta8: "a,d",
      pergunta9: "Não",
      pergunta12: "Não",
    };

    setEstado(mockMsg.from, estadoSimulado);
    console.log("✅ Estado simulado criado para pergunta 14");

    // Chamar o fluxo de perguntas
    await fluxoPerguntas(mockClient, mockMsg);

    console.log("✅ Teste de salvamento direto concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    console.error("Stack:", error.stack);
  }
}

testarSalvamentoDireto();
