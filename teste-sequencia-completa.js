// Teste para detectar de onde vem a mensagem "Obrigado!"
const { setEstado, getEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas");

// Mock do cliente para capturar todas as mensagens
const mensagensEnviadas = [];
const mockClient = {
  sendText: async (id, message) => {
    console.log(`📱 MENSAGEM ENVIADA para ${id}:`);
    console.log(`"${message}"`);
    console.log("---");
    mensagensEnviadas.push(message);
  },
};

// Simular sequência: pergunta12 ("Não") -> pergunta14 ("Não")
async function testarSequenciaCompleta() {
  try {
    console.log("🧪 Testando sequência completa pergunta12 -> pergunta14...");

    // Estado até pergunta 12
    const estadoAntesP12 = {
      nome: "João Teste Sequencia",
      nascimento: "15/05/1990",
      cpf: "12345678900",
      telefone: "11999887766",
      email: "joao.seq@email.com",
      cep: "01000000",
      rua: "Rua Teste Seq",
      numero: "123",
      bairro: "Centro",
      complemento: "Apto 45",
      etapa: "perguntas",
      etapa3: "pergunta12",
      menorIdade: "Não",
      pergunta1: "Sim",
      pergunta2: "Não",
      pergunta3: "Sim",
      pergunta5: "Sim",
      pergunta6: "a,b",
      pergunta7: "Diagnóstico teste",
      pergunta8: "a",
      pergunta9: "Não",
    };

    // 1. Simular resposta "Não" na pergunta 12
    console.log("\n🎯 PASSO 1: Respondendo 'Não' na pergunta 12...");
    setEstado("test@seq", estadoAntesP12);

    const msgP12 = { from: "test@seq", body: "Não" };
    await fluxoPerguntas(mockClient, msgP12);

    console.log("\n📊 Estado após pergunta 12:");
    const estadoAposP12 = getEstado("test@seq");
    console.log(`Etapa atual: ${estadoAposP12?.etapa3}`);
    console.log(`Pergunta12: ${estadoAposP12?.pergunta12}`);

    // 2. Simular resposta "Não" na pergunta 14
    console.log("\n🎯 PASSO 2: Respondendo 'Não' na pergunta 14...");

    const msgP14 = { from: "test@seq", body: "Não" };
    await fluxoPerguntas(mockClient, msgP14);

    console.log("\n📊 Estado após pergunta 14:");
    const estadoAposP14 = getEstado("test@seq");
    console.log(`Estado existe: ${!!estadoAposP14}`);
    if (estadoAposP14) {
      console.log(`Etapa atual: ${estadoAposP14?.etapa3}`);
    }

    console.log("\n📝 RESUMO DAS MENSAGENS ENVIADAS:");
    mensagensEnviadas.forEach((msg, index) => {
      console.log(`${index + 1}. "${msg}"`);
    });

    console.log(`\nTotal de mensagens: ${mensagensEnviadas.length}`);
  } catch (error) {
    console.error("❌ Erro no teste de sequência:", error);
    console.error("Stack:", error.stack);
  }
}

testarSequenciaCompleta();
