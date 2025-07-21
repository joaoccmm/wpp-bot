const { JWT } = require("google-auth-library");

function criarAuth() {
  let credentials;

  if (process.env.GOOGLE_CREDENTIALS) {
    try {
      // Em produção (Railway), usar variável de ambiente
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      console.log("✅ Usando credenciais do environment (Railway)");
    } catch (error) {
      throw new Error(
        `❌ Erro ao parsear GOOGLE_CREDENTIALS: ${error.message}`
      );
    }
  } else {
    try {
      // Em desenvolvimento, usar arquivo local
      credentials = require("../credenciais-google.json");
      console.log("✅ Usando credenciais do arquivo local");
    } catch (error) {
      throw new Error(
        `❌ Credenciais Google não encontradas!\n` +
          `   - Em desenvolvimento: certifique-se que 'credenciais-google.json' existe\n` +
          `   - Em produção: configure a variável GOOGLE_CREDENTIALS no Railway\n` +
          `   - Execute 'node setup-railway.js' para instruções detalhadas`
      );
    }
  }

  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

module.exports = criarAuth;
