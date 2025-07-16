// Teste completo para investigar por que o chat pode estar parando na pergunta 7

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

// Mock de client com logs mais detalhados
const mockClient = {
  sendText: async (id, msg) => {
    console.log(
      `📱 [${new Date().toLocaleTimeString()}] Mensagem para ${id.slice(-4)}:`
    );
    console.log(`${msg}`);
    console.log("─".repeat(60));
    return Promise.resolve();
  },
};

async function testeFluxoCompleto() {
  console.log("🔍 INVESTIGAÇÃO COMPLETA - PROBLEMA NA PERGUNTA 7\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  console.log("📋 Cenário de teste:");
  console.log("1. Usuário iniciando das perguntas 5-7 (danos físicos)");
  console.log("2. Simulando diferentes respostas que podem causar problemas\n");

  // Configurar usuário para começar nas perguntas de dano físico
  setEstado(userId, {
    etapa: "perguntas",
    etapa3: "pergunta5",
    nome: "João Teste",
    telefone: "11999999999",
    pergunta1: "sim",
    pergunta2: "não",
    pergunta3: "não",
    pergunta4: "não",
  });

  console.log("━━━ TESTE 1: Fluxo normal ━━━");

  try {
    // Pergunta 5: Teve dano físico? - SIM
    console.log("🔸 Pergunta 5: 'sim' (teve dano físico)");
    await fluxoPerguntas(mockClient, { from: userId, body: "sim" });

    const estado1 = getEstado(userId);
    console.log(`✓ Etapa atual: ${estado1?.etapa3}\n`);

    // Pergunta 6: Tipos de dano - resposta válida
    console.log("🔸 Pergunta 6: 'a,b' (tipos de dano)");
    await fluxoPerguntas(mockClient, { from: userId, body: "a,b" });

    const estado2 = getEstado(userId);
    console.log(`✓ Etapa atual: ${estado2?.etapa3}\n`);

    // Pergunta 7: Diagnóstico - resposta válida
    console.log("🔸 Pergunta 7: 'Dermatite em 2016' (diagnóstico)");
    await fluxoPerguntas(mockClient, {
      from: userId,
      body: "Dermatite em 2016",
    });

    const estado3 = getEstado(userId);
    console.log(`✓ Etapa atual: ${estado3?.etapa3}\n`);

    if (estado3?.etapa3 === "pergunta8") {
      console.log("✅ TESTE 1 - SUCESSO! Fluxo normal funcionando\n");
    } else {
      console.log("❌ TESTE 1 - FALHOU! Não avançou para pergunta 8\n");
    }
  } catch (error) {
    console.log("❌ TESTE 1 - ERRO:", error.message, "\n");
  }

  console.log("━━━ TESTE 2: Respostas problemáticas ━━━");

  // Resetar para pergunta 7
  setEstado(userId, {
    etapa: "perguntas",
    etapa3: "pergunta7",
    nome: "João Teste",
    telefone: "11999999999",
    pergunta1: "sim",
    pergunta2: "não",
    pergunta3: "não",
    pergunta4: "não",
    pergunta5: "sim",
    pergunta6: "a,b",
  });

  const respostasProblematicas = [
    "", // string vazia
    " ", // só espaço
    "   ", // múltiplos espaços
    "\n", // quebra de linha
    "não sei", // resposta evasiva
    "nenhum", // resposta negativa
    "não tive", // resposta de negação
  ];

  for (let i = 0; i < respostasProblematicas.length; i++) {
    const resposta = respostasProblematicas[i];
    const descricao =
      resposta === ""
        ? "[string vazia]"
        : resposta === " "
        ? "[espaço]"
        : resposta === "   "
        ? "[múltiplos espaços]"
        : resposta === "\n"
        ? "[quebra de linha]"
        : `"${resposta}"`;

    console.log(`🔸 Teste ${i + 1}: Resposta ${descricao}`);

    try {
      await fluxoPerguntas(mockClient, { from: userId, body: resposta });

      const estado = getEstado(userId);
      console.log(`   → Etapa após resposta: ${estado?.etapa3}`);

      if (estado?.etapa3 === "pergunta8") {
        console.log("   ✅ Avançou para pergunta 8");
      } else if (estado?.etapa3 === "pergunta7") {
        console.log(
          "   ⚠️  Permaneceu na pergunta 7 (possível causa do problema!)"
        );
      } else {
        console.log(`   ❓ Estado inesperado: ${estado?.etapa3}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }

    console.log("");

    // Resetar para pergunta 7 para próximo teste
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta7",
      nome: "João Teste",
      telefone: "11999999999",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
      pergunta4: "não",
      pergunta5: "sim",
      pergunta6: "a,b",
    });
  }

  console.log("━━━ ANÁLISE DOS RESULTADOS ━━━");
  console.log("Se alguma resposta fez o usuário ficar na pergunta 7,");
  console.log("essa pode ser a causa do problema relatado.\n");

  // Limpar estado
  limparEstado(userId);
  console.log("🧹 Estado limpo");
}

testeFluxoCompleto().catch(console.error);
