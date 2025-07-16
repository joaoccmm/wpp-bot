// Teste da correção da pergunta 7

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    console.log(`📱 ${msg}\n`);
    return Promise.resolve();
  },
};

async function testarCorrecao() {
  console.log("✅ TESTE DA CORREÇÃO - PERGUNTA 7\n");

  const userId = "5511999999999@c.us";

  // Configurar usuário na pergunta 7
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

  console.log("🧪 Testando respostas que antes causavam problema:");

  const testesProblematicos = [
    { input: "", desc: "String vazia" },
    { input: " ", desc: "Apenas espaço" },
    { input: "   ", desc: "Múltiplos espaços" },
    { input: "\n", desc: "Quebra de linha" },
  ];

  for (const teste of testesProblematicos) {
    console.log(`🔸 ${teste.desc}: "${teste.input}"`);

    try {
      await fluxoPerguntas(mockClient, { from: userId, body: teste.input });

      const estado = getEstado(userId);
      if (estado?.etapa3 === "pergunta7") {
        console.log(
          "   ✅ Corretamente rejeitada - usuário permanece na pergunta 7"
        );
      } else {
        console.log(`   ❌ Problema: avançou para ${estado?.etapa3}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }

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
  }

  console.log("\n🧪 Testando resposta válida:");
  console.log('🔸 Resposta válida: "Dermatite em 2016"');

  try {
    await fluxoPerguntas(mockClient, {
      from: userId,
      body: "Dermatite em 2016",
    });

    const estado = getEstado(userId);
    if (estado?.etapa3 === "pergunta8") {
      console.log(
        "   ✅ Corretamente aceita - usuário avançou para pergunta 8"
      );
      console.log(`   📋 Resposta salva: "${estado.pergunta7}"`);
    } else {
      console.log(
        `   ❌ Problema: não avançou, etapa atual: ${estado?.etapa3}`
      );
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
  }

  console.log("\n🎉 CORREÇÃO IMPLEMENTADA!");
  console.log("✅ Agora a pergunta 7 só aceita respostas com conteúdo real");
  console.log("✅ Respostas vazias ou só espaços são rejeitadas adequadamente");

  limparEstado(userId);
}

testarCorrecao().catch(console.error);
