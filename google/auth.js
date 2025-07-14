const { JWT } = require("google-auth-library");
const creds = require("../credenciais-google.json");

function criarAuth() {
  return new JWT({
    email: creds.client_email,
    key: creds.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

module.exports = criarAuth;
