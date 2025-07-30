const { GoogleSpreadsheet } = require("google-spreadsheet");
const criarAuth = require("./google/auth");

const SPREADSHEET_ID = "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g";

async function testarAcesso() {
  try {
    console.log("🔧 Testando acesso à planilha...");

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    doc.auth = criarAuth();

    console.log("📊 Carregando informações...");
    await doc.loadInfo();

    console.log("✅ Planilha encontrada:", doc.title);
    console.log("📊 Total de abas:", doc.sheetCount);

    const sheet = doc.sheetsByIndex[0];
    console.log("📄 Primeira aba:", sheet.title);
    console.log("📏 Linhas:", sheet.rowCount);
    console.log("📐 Colunas:", sheet.columnCount);

    // Tentar adicionar uma linha simples
    console.log("💾 Testando adição de linha...");
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      id: "teste-" + Date.now(),
      nome: "Teste de Acesso",
    });

    console.log("✅ Teste concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
    console.error("🔍 Detalhes:", error);
  }
}

testarAcesso();
