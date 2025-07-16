const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./credenciais-google.json");

const doc = new GoogleSpreadsheet(
  "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g"
);

async function teste() {
  console.log(
    "useServiceAccountAuth existe?",
    typeof doc.useServiceAccountAuth
  );
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key.replace(/\\n/g, "\n"),
  });
  await doc.loadInfo();
  console.log("Planilha carregada:", doc.title);
}

teste().catch(console.error);
