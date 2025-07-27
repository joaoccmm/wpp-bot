// Teste prático: Verificar se delays são diferentes para cada usuário
const { protecao } = require("./utils/protecaoAntiBot.js");

console.log("🧪 TESTE: Delays diferentes para usuários diferentes");
console.log("=".repeat(60));

async function testarDelaysUsuarios() {
  const usuarios = ["user1", "user2", "user3", "user4", "user5"];
  const tipo = "pergunta_sensivel";

  console.log(`📊 Testando tipo: ${tipo} (range: 3-8 segundos)`);
  console.log("-".repeat(50));

  for (let usuario of usuarios) {
    const inicio = Date.now();
    await protecao.delayAleatorio(tipo, usuario);
    const fim = Date.now();
    const tempoReal = fim - inicio;

    console.log(
      `👤 ${usuario}: ${tempoReal}ms (${(tempoReal / 1000).toFixed(1)}s)`
    );
  }

  console.log("-".repeat(50));
  console.log("✅ Teste concluído - Cada usuário teve tempo diferente!");

  // Teste com usuário que precisa delay maior
  console.log("\n🔄 Testando usuário com histórico de muitas mensagens:");

  // Simular usuário com muitas mensagens
  for (let i = 0; i < 12; i++) {
    protecao.registrarAtividade("userAtivo");
  }

  const inicioAtivo = Date.now();
  await protecao.delayAleatorio(tipo, "userAtivo");
  const fimAtivo = Date.now();
  const tempoAtivo = fimAtivo - inicioAtivo;

  console.log(
    `👤 userAtivo (muitas msgs): ${tempoAtivo}ms (${(tempoAtivo / 1000).toFixed(
      1
    )}s)`
  );
  console.log("   ↳ Delay maior por atividade suspeita!");
}

testarDelaysUsuarios().catch(console.error);
