// Teste exato do cenário da imagem - pergunta 7 respondida com "não"

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    console.log(`📱 Bot enviou:\n${msg}\n${"─".repeat(60)}`);
    return Promise.resolve();
  },
};

async function reproduzirCenarioImagem() {
  console.log("🎯 REPRODUZINDO CENÁRIO EXATO DA IMAGEM\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  try {
    // Configurar exatamente como aparece na imagem
    // Pergunta 5: Transtorno psiquiátrico → NÃO
    // Pergunta 6: Perdas propriedade → NÃO
    // Pergunta 7: Mudança de casa → NÃO

    console.log("📋 Configurando estado inicial (simulando até pergunta 6):");
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta5", // Começar da pergunta 5
      nome: "Usuário Teste",
      telefone: "11999999999",
      email: "teste@email.com",
      pergunta1: "sim", // Ação na Inglaterra
      pergunta2: "não", // Indígena/Quilombola
      pergunta3: "não", // Mesmo endereço
    });

    // PASSO 1: Pergunta 5 - Transtorno psiquiátrico
    console.log("🔸 PASSO 1: Pergunta 5 - 'não' (sem transtorno psiquiátrico)");
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    let estado = getEstado(userId);
    console.log(`   ✓ Estado atual: ${estado?.etapa3}`);
    console.log(`   ✓ Pergunta 5 salva: ${estado?.pergunta5}\n`);

    // PASSO 2: Pergunta 6 - Perdas em propriedade
    console.log("🔸 PASSO 2: Pergunta 6 - 'não' (sem perdas em propriedade)");
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    estado = getEstado(userId);
    console.log(`   ✓ Estado atual: ${estado?.etapa3}`);
    console.log(`   ✓ Pergunta 12 salva: ${estado?.pergunta12}\n`);

    // PASSO 3: Pergunta 7 - Mudança de casa (AQUI ESTÁ O PROBLEMA)
    console.log(
      "🔸 PASSO 3: Pergunta 7 - 'não' (não se mudou) ← PROBLEMA AQUI"
    );
    console.log("❗ ESPERADO: Deve ir para pergunta 8 (pergunta 19 interna)");
    console.log("❌ ATUAL: Está finalizando prematuramente\n");

    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    estado = getEstado(userId);
    console.log(`   ✓ Estado atual: ${estado?.etapa3}`);
    console.log(`   ✓ Pergunta 14 salva: ${estado?.pergunta14}`);

    if (!estado) {
      console.log(
        "❌ PROBLEMA CONFIRMADO: Estado foi limpo = fluxo finalizou prematuramente!"
      );
    } else if (estado.etapa3 === "pergunta19") {
      console.log("✅ CORRETO: Avançou para pergunta 19 (pergunta 8 visual)");
    } else {
      console.log(`⚠️  INESPERADO: Etapa atual é ${estado.etapa3}`);
    }

    console.log("\n🔍 ANÁLISE DO PROBLEMA:");
    if (!estado) {
      console.log(
        "- O estado foi limpo, indicando que salvarDadosCompletos foi chamado"
      );
      console.log(
        "- A função verificarFluxoCompleto está retornando true incorretamente"
      );
      console.log(
        "- Precisa corrigir a lógica de verificação de fluxo completo"
      );
    }
  } catch (error) {
    console.error("❌ ERRO:", error.message);
  }

  // Limpar estado se ainda existir
  if (getEstado(userId)) {
    limparEstado(userId);
  }
}

reproduzirCenarioImagem().catch(console.error);
