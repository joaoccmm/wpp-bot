// Teste específico da pergunta 14 (pergunta 7 visual)

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    console.log(
      `📱 Bot: ${msg.substring(0, 100)}${msg.length > 100 ? "..." : ""}\n`
    );
    return Promise.resolve();
  },
};

async function testarPergunta14() {
  console.log("🔍 TESTE ESPECÍFICO - PERGUNTA 14 (PERGUNTA 7 VISUAL)\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  try {
    // Configurar diretamente na pergunta 14
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta14",
      nome: "Usuário Teste",
      telefone: "11999999999",
      email: "teste@email.com",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
      pergunta5: "não",
      pergunta9: "não",
      pergunta12: "não",
    });

    console.log("📋 Estado configurado na pergunta 14");
    console.log("🔸 Respondendo 'não' na pergunta 14...\n");

    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    const estado = getEstado(userId);

    if (!estado) {
      console.log(
        "❌ PROBLEMA: Estado foi limpo - fluxo finalizou prematuramente!"
      );
      console.log(
        "📊 Isso significa que salvarDadosCompletos foi chamado incorretamente."
      );
    } else {
      console.log(`✅ Estado mantido - Etapa atual: ${estado.etapa3}`);
      if (estado.etapa3 === "pergunta19") {
        console.log("✅ CORRETO: Avançou para pergunta 19 (pergunta 8 visual)");
      } else {
        console.log("⚠️  INESPERADO: Não foi para pergunta 19");
      }
    }
  } catch (error) {
    console.error("❌ ERRO:", error.message);
  }

  // Tentar limpar se ainda existir
  if (getEstado(userId)) {
    limparEstado(userId);
  }
}

testarPergunta14().catch(console.error);
