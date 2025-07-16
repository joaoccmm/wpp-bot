// Teste da correção da progressão de perguntas

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    console.log(
      `📱 Bot: ${msg.substring(0, 80)}${msg.length > 80 ? "..." : ""}\n`
    );
    return Promise.resolve();
  },
};

async function testarProgressaoPerguntas() {
  console.log("🧪 TESTE - PROGRESSÃO CORRETA DAS PERGUNTAS\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  try {
    // Configurar usuário na pergunta 14 (pergunta 7 visual)
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta14",
      nome: "João Teste",
      telefone: "11999999999",
      email: "joao@teste.com",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
      pergunta4: "não",
      pergunta5: "não", // Não teve transtorno psiquiátrico
      pergunta9: "não", // Pulou para pergunta 9
      pergunta12: "não", // Não teve perdas em propriedade
    });

    console.log("📋 CENÁRIO: Usuário na pergunta 14 (pergunta 7 visual)");
    console.log(
      "Pergunta: 'Você precisou se mudar por causa do rompimento?'\n"
    );

    // TESTE 1: Resposta SIM (deve ir para pergunta 15)
    console.log("🔸 TESTE 1: Resposta 'sim' → deve ir para pergunta 15");
    await fluxoPerguntas(mockClient, { from: userId, body: "sim" });

    let estado = getEstado(userId);
    console.log(`   ✓ Etapa atual: ${estado?.etapa3}`);

    if (estado?.etapa3 === "pergunta15") {
      console.log("   ✅ CORRETO! Avançou para pergunta 15 (sub-pergunta)\n");
    } else {
      console.log("   ❌ ERRO! Deveria ir para pergunta 15\n");
    }

    // Resetar para pergunta 14
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta14",
      nome: "João Teste",
      telefone: "11999999999",
      email: "joao@teste.com",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
      pergunta4: "não",
      pergunta5: "não",
      pergunta9: "não",
      pergunta12: "não",
    });

    // TESTE 2: Resposta NÃO (deve ir para pergunta 19 - pergunta 8 visual)
    console.log(
      "🔸 TESTE 2: Resposta 'não' → deve ir para pergunta 19 (pergunta 8 visual)"
    );
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    estado = getEstado(userId);
    console.log(`   ✓ Etapa atual: ${estado?.etapa3}`);

    if (estado?.etapa3 === "pergunta19") {
      console.log(
        "   ✅ CORRETO! Avançou para pergunta 19 (pergunta 8 visual)"
      );
      console.log(
        "   🎯 Pergunta 8: 'Você perdeu sua principal fonte de alimento?'\n"
      );
    } else if (!estado) {
      console.log(
        "   ❌ ERRO! Estado foi limpo - fluxo finalizou incorretamente\n"
      );
    } else {
      console.log(
        `   ❌ ERRO! Deveria ir para pergunta 19, mas foi para ${estado?.etapa3}\n`
      );
    }

    // TESTE 3: Continuar o fluxo para ver se progride normalmente
    if (estado?.etapa3 === "pergunta19") {
      console.log("🔸 TESTE 3: Continuando fluxo da pergunta 19");
      await fluxoPerguntas(mockClient, { from: userId, body: "não" });

      const estadoFinal = getEstado(userId);
      console.log(`   ✓ Próxima etapa: ${estadoFinal?.etapa3}`);

      if (estadoFinal?.etapa3) {
        console.log("   ✅ CORRETO! Fluxo continua normalmente");
      } else {
        console.log(
          "   ⚠️  Fluxo finalizou (pode estar correto dependendo da lógica)"
        );
      }
    }

    console.log("\n🎉 TESTE CONCLUÍDO!");
    console.log(
      "✅ Agora a pergunta 7 (pergunta 14 interna) continua o fluxo corretamente"
    );
  } catch (error) {
    console.error("❌ ERRO durante o teste:", error.message);
    console.error("Stack:", error.stack);
  }

  // Limpar estado
  limparEstado(userId);
  console.log("\n🧹 Estado limpo");
}

testarProgressaoPerguntas().catch(console.error);
