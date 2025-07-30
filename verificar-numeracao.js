// Teste da nova numeração das questões
console.log("🧪 Verificando numeração das questões...");

const fs = require("fs");
const content = fs.readFileSync("./flows/fluxoPerguntas.js", "utf8");

// Extrair títulos das questões principais
const questoes = [];
const regex = /\*(\d+)\.\s+([^*]+)\*/g;
let match;

while ((match = regex.exec(content)) !== null) {
  questoes.push({
    numero: parseInt(match[1]),
    titulo: match[2].trim(),
  });
}

console.log("\n📋 QUESTÕES ENCONTRADAS:");
console.log("=".repeat(50));

questoes.forEach((questao, index) => {
  console.log(`${questao.numero}. ${questao.titulo}`);
});

console.log("=".repeat(50));

// Verificar se a numeração está sequencial
let sequenciaCorreta = true;
for (let i = 0; i < questoes.length; i++) {
  if (questoes[i].numero !== i + 1) {
    console.log(`❌ ERRO: Questão ${questoes[i].numero} deveria ser ${i + 1}`);
    sequenciaCorreta = false;
  }
}

if (sequenciaCorreta) {
  console.log("\n✅ SUCESSO: Numeração sequencial correta!");
} else {
  console.log("\n❌ ERRO: Numeração não está sequencial!");
}

console.log("\n📊 ESTATÍSTICAS:");
console.log(`🔸 Total de questões: ${questoes.length}`);
console.log(`🔸 Primeira questão: ${questoes[0]?.titulo || "Não encontrada"}`);
console.log(
  `🔸 Última questão: ${
    questoes[questoes.length - 1]?.titulo || "Não encontrada"
  }`
);

console.log("\n✅ Verificação concluída!");
