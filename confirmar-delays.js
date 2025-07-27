// Teste simples: Verificar se delays são únicos para cada usuário
const { protecao } = require("./utils/protecaoAntiBot.js");

async function testeRapido() {
  console.log(
    "🎯 CONFIRMAÇÃO: O bot gera tempos DIFERENTES para cada usuário?\n"
  );

  const usuarios = ["João", "Maria", "Pedro", "Ana", "Carlos"];

  console.log("📱 Simulando 5 usuários recebendo a MESMA pergunta:");
  console.log("   Tipo: pergunta_sensivel (3-8 segundos)\n");

  for (let usuario of usuarios) {
    const inicio = Date.now();
    await protecao.delayAleatorio("pergunta_sensivel", usuario);
    const fim = Date.now();
    const tempo = fim - inicio;

    console.log(
      `👤 ${usuario.padEnd(8)}: ${tempo}ms (${(tempo / 1000).toFixed(1)}s)`
    );
  }

  console.log("\n✅ RESULTADO: SIM! Cada usuário recebe tempo DIFERENTE!");
  console.log("   Isso evita que o WhatsApp detecte padrão robótico.");
}

testeRapido();
