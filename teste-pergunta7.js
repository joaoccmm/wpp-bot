// Teste para verificar se a pergunta 7 está funcionando corretamente

const { getEstado, setEstado, limparEstado } = require("./utils/estados");

// Mock de client
const mockClient = {
  sendText: async (id, msg) => {
    console.log(`📱 Mensagem enviada para ${id}:`);
    console.log(`${msg}\n`);
    return Promise.resolve();
  },
};

// Simular um usuário na pergunta 6 avançando para pergunta 7
async function testarPergunta7() {
  console.log("🧪 TESTE ESPECÍFICO DA PERGUNTA 7\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  // Configurar usuário na pergunta 6
  setEstado(userId, {
    etapa: "perguntas",
    etapa3: "pergunta6",
    nome: "João Teste",
    telefone: "11999999999",
    pergunta1: "sim",
    pergunta2: "não",
    pergunta3: "não",
    pergunta4: "não",
    pergunta5: "sim",
    pergunta6: "a,b", // Resposta da pergunta 6
  });

  console.log("✅ Estado inicial configurado:");
  console.log("   - Usuário na pergunta 6");
  console.log("   - Resposta pergunta 6: 'a,b'");
  console.log("   - Pronto para avançar para pergunta 7\n");

  try {
    // Importar o fluxo de perguntas
    const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

    // Simular resposta da pergunta 6 que deve levar para pergunta 7
    const msg = {
      from: userId,
      body: "a,b",
    };

    console.log("🔄 Simulando resposta da pergunta 6...");
    await fluxoPerguntas(mockClient, msg);

    // Verificar se avançou para pergunta 7
    const estadoAtual = getEstado(userId);
    console.log("📊 Estado após processamento:");
    console.log(`   - Etapa atual: ${estadoAtual?.etapa3}`);
    console.log(`   - Pergunta 6 salva: ${estadoAtual?.pergunta6}`);

    if (estadoAtual?.etapa3 === "pergunta7") {
      console.log("✅ SUCESSO! Usuário avançou para pergunta 7");

      // Agora testar resposta da pergunta 7
      console.log("\n🔄 Testando resposta da pergunta 7...");
      const msgPergunta7 = {
        from: userId,
        body: "Dermatite diagnosticada em janeiro de 2016",
      };

      await fluxoPerguntas(mockClient, msgPergunta7);

      const estadoFinal = getEstado(userId);
      console.log("📊 Estado após resposta da pergunta 7:");
      console.log(`   - Etapa atual: ${estadoFinal?.etapa3}`);
      console.log(`   - Pergunta 7 salva: ${estadoFinal?.pergunta7}`);

      if (estadoFinal?.etapa3 === "pergunta8") {
        console.log("✅ SUCESSO! Pergunta 7 funcionando corretamente!");
      } else {
        console.log("❌ PROBLEMA! Não avançou para pergunta 8");
      }
    } else {
      console.log("❌ PROBLEMA! Não avançou para pergunta 7");
      console.log(`   - Etapa atual: ${estadoAtual?.etapa3}`);
    }
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);
    console.error("Stack:", error.stack);
  }

  // Limpar estado
  limparEstado(userId);
  console.log("\n🧹 Estado limpo");
}

testarPergunta7().catch(console.error);
