const { JWT } = require("google-auth-library");

function criarAuth() {
  // Usar variáveis de ambiente em produção, fallback para arquivo local
  let credentials;

  if (process.env.GOOGLE_CREDENTIALS) {
    // Em produção (Railway), usar variável de ambiente
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  } else {
    // Em desenvolvimento, usar arquivo local
    credentials = require("../credenciais-google.json");
  }

  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

module.exports = criarAuth;
