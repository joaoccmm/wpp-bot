const { GoogleSpreadsheet } = require("google-spreadsheet");
const criarAuth = require("./auth");

const SPREADSHEET_ID = "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g";
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function inicializarPlanilha() {
  try {
    doc.auth = criarAuth();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.setHeaderRow([
      "Nome",
      "Nascimento",
      "CPF",
      "Telefone",
      "Email",
      "CEP",
      "Rua",
      "Numero",
      "Bairro",
      "Complemento",
    ]);
    console.log("Planilha carregada:", doc.title);
  } catch (error) {
    console.error("Erro ao inicializar planilha:", error);
    throw error;
  }
}

async function salvarNoSheets(
  nome,
  nascimento,
  cpf,
  telefone,
  email,
  cep,
  rua,
  numero,
  bairro,
  complemento
) {
  try {
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      Nome: nome,
      Nascimento: nascimento,
      CPF: cpf,
      Telefone: telefone,
      Email: email,
      CEP: cep,
      Rua: rua,
      Número: numero,
      Bairro: bairro,
      Complemento: complemento,
    });
    console.log("Dados salvos:", {
      nome,
      nascimento,
      cpf,
      telefone,
      email,
      cep,
      rua,
      numero,
      bairro,
      complemento,
    });
  } catch (error) {
    console.error("Erro ao salvar na planilha:", error);
    throw error;
  }
}

module.exports = { inicializarPlanilha, salvarNoSheets };
