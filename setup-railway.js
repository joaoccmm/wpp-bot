#!/usr/bin/env node

// Script para configurar credenciais Google no Railway
const fs = require("fs");
const path = require("path");

console.log("🔧 Configurando credenciais Google para Railway...\n");

// Ler o arquivo de credenciais local
const credentialsPath = path.join(__dirname, "credenciais-google.json");

try {
  const credentials = fs.readFileSync(credentialsPath, "utf8");

  // Validar se é um JSON válido
  JSON.parse(credentials);

  console.log("📋 INSTRUÇÕES PARA CONFIGURAR NO RAILWAY:");
  console.log("===============================================\n");

  console.log("1. Acesse https://railway.app");
  console.log("2. Entre no seu projeto");
  console.log('3. Vá na aba "Variables"');
  console.log("4. Adicione uma nova variável:");
  console.log("   Nome: GOOGLE_CREDENTIALS");
  console.log("   Valor: (copie o JSON abaixo)\n");

  console.log("📄 VALOR DA VARIÁVEL (copie tudo):");
  console.log("==================================");
  console.log(credentials);
  console.log("==================================\n");

  console.log("5. Salve a variável");
  console.log("6. O Railway fará redeploy automaticamente");
  console.log("7. ✅ Pronto! Google Sheets funcionará");
} catch (error) {
  console.error("❌ Erro ao ler credenciais:", error.message);
  console.log(
    "\n💡 Certifique-se que o arquivo credenciais-google.json existe"
  );
}
