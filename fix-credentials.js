// Script para gerar JSON sem quebras de linha problemáticas
const fs = require("fs");

// Ler o arquivo original
const creds = require("./credenciais-google.json");

// Criar versão "escape-safe" para Railway
const railwaySafe = {
  ...creds,
  // Remover e recriar private_key com escapes corretos
  private_key: creds.private_key.replace(/\n/g, "\\n"),
};

console.log("🔧 VERSÃO RAILWAY-SAFE:");
console.log("=".repeat(50));
console.log(JSON.stringify(railwaySafe, null, 2));
console.log("=".repeat(50));

console.log("\n📋 VERSÃO MINIFICADA (para copiar no Railway):");
console.log("=".repeat(50));
console.log(JSON.stringify(railwaySafe));
console.log("=".repeat(50));

// Salvar arquivo de teste
fs.writeFileSync(
  "railway-credentials.json",
  JSON.stringify(railwaySafe, null, 2)
);
console.log("\n✅ Arquivo salvo como railway-credentials.json");
