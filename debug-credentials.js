// Script para debugar as credenciais Google no Railway
console.log("🔍 Debugando credenciais Google...\n");

// 1. Verificar se a variável existe
console.log("1. Verificando variável GOOGLE_CREDENTIALS:");
console.log("Existe:", !!process.env.GOOGLE_CREDENTIALS);
console.log("Tipo:", typeof process.env.GOOGLE_CREDENTIALS);

if (process.env.GOOGLE_CREDENTIALS) {
  console.log("Primeiros 100 chars:", process.env.GOOGLE_CREDENTIALS.substring(0, 100));
  console.log("Últimos 50 chars:", process.env.GOOGLE_CREDENTIALS.slice(-50));
  
  // 2. Tentar fazer parse
  try {
    const parsed = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log("\n2. ✅ JSON parseado com sucesso!");
    console.log("Campos encontrados:", Object.keys(parsed));
    console.log("project_id:", parsed.project_id);
    console.log("client_email:", parsed.client_email);
    console.log("private_key existe:", !!parsed.private_key);
    console.log("private_key primeiros 50 chars:", parsed.private_key ? parsed.private_key.substring(0, 50) : "N/A");
  } catch (error) {
    console.log("\n2. ❌ Erro no parse JSON:");
    console.log("Erro:", error.message);
  }
} else {
  console.log("❌ Variável GOOGLE_CREDENTIALS não encontrada");
  
  // Verificar arquivo local
  try {
    const localCreds = require("./credenciais-google.json");
    console.log("\n3. ✅ Arquivo local encontrado!");
    console.log("project_id local:", localCreds.project_id);
  } catch (error) {
    console.log("\n3. ❌ Arquivo local também não encontrado:", error.message);
  }
}

console.log("\n4. Todas as variáveis de ambiente:");
Object.keys(process.env).forEach(key => {
  if (key.includes('GOOGLE') || key.includes('google')) {
    console.log(`${key}: ${process.env[key] ? 'EXISTE' : 'VAZIO'}`);
  }
});
