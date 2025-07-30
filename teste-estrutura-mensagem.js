// Teste simples da mensagem unificada
console.log("🧪 Testando estrutura da mensagem unificada...");

// Importar apenas as mensagens
const fs = require("fs");
const cadastroContent = fs.readFileSync("./flows/cadastro.js", "utf8");

// Extrair a mensagem saudacaoInicial usando regex
const mensagemMatch = cadastroContent.match(
  /saudacaoInicial:\s*"([^"]+(?:"[^"]*"[^"]*)*?)"/s
);
if (mensagemMatch) {
  const mensagem = mensagemMatch[1]
    .replace(/\\n/g, "\n")
    .replace(/\\" \+/g, "")
    .replace(/\s+\+\s*$/g, "")
    .trim();

  console.log("\n📝 Mensagem unificada:");
  console.log("=".repeat(50));
  console.log(mensagem);
  console.log("=".repeat(50));

  // Verificações
  const contemSaudacao =
    mensagem.includes("Olá!") && mensagem.includes("assistente virtual");
  const contemInstrucoes =
    mensagem.includes("10 e 15 minutos") && mensagem.includes("cancelar");
  const contemPergunta =
    mensagem.includes("Vamos começar?") && mensagem.includes("Sim ou Não");

  console.log("\n✅ Verificações:");
  console.log("🔸 Contém saudação:", contemSaudacao);
  console.log("🔸 Contém instruções:", contemInstrucoes);
  console.log("🔸 Contém pergunta:", contemPergunta);
  console.log("🔸 Tamanho:", mensagem.length, "caracteres");

  if (contemSaudacao && contemInstrucoes && contemPergunta) {
    console.log("\n🎉 SUCESSO! Mensagem unificada está correta!");
  } else {
    console.log("\n❌ ERRO! Algo está faltando na mensagem.");
  }
} else {
  console.log("❌ Não foi possível extrair a mensagem.");
}

console.log("\n✅ Teste concluído!");
