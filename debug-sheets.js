console.log("🔧 Iniciando debug do Google Sheets...");

const { GoogleSpreadsheet } = require("google-spreadsheet");

console.log("📦 Pacote google-spreadsheet carregado");

try {
  const criarAuth = require("./google/auth");
  console.log("✅ Módulo de auth carregado");

  const auth = criarAuth();
  console.log("✅ Auth criado:", typeof auth);

  const SPREADSHEET_ID = "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g";
  console.log("📊 ID da planilha:", SPREADSHEET_ID);

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  console.log("✅ Documento criado");

  doc.auth = auth;
  console.log("✅ Auth configurado");

  console.log("🔄 Tentando loadInfo...");
  doc
    .loadInfo()
    .then(() => {
      console.log("✅ LoadInfo concluído!");
      console.log("📊 Título:", doc.title);
    })
    .catch((err) => {
      console.error("❌ Erro no loadInfo:", err.message);
    });
} catch (error) {
  console.error("❌ Erro na inicialização:", error.message);
}
