// const venom = require("venom-bot");
// const { GoogleSpreadsheet } = require("google-spreadsheet");
// const { JWT } = require("google-auth-library");
// const creds = require("./credenciais-google.json");

// const SPREADSHEET_ID = "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g";

// const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
// let estados = {};

// async function inicializarPlanilha() {
//   try {
//     // Configuração do JWT para autenticação
//     const serviceAccountAuth = new JWT({
//       email: creds.client_email,
//       key: creds.private_key.replace(/\\n/g, "\n"),
//       scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//     });

//     // Atribui a autenticação ao documento
//     doc.auth = serviceAccountAuth;

//     await doc.loadInfo();
//     console.log("Planilha carregada:", doc.title);

//     // Verifica se a planilha tem as colunas necessárias
//     const sheet = doc.sheetsByIndex[0];
//     await sheet.setHeaderRow(["Nome", "Nascimento", "CPF"]);

//     return true;
//   } catch (error) {
//     console.error("Erro ao inicializar planilha:", error);
//     throw error;
//   }
// }

// async function salvarNoSheets(nome, nascimento, cpf) {
//   try {
//     const sheet = doc.sheetsByIndex[0];
//     await sheet.addRow({
//       Nome: nome,
//       Nascimento: nascimento,
//       CPF: cpf,
//     });
//     console.log("Dados salvos na planilha:", { nome, nascimento, cpf });
//   } catch (error) {
//     console.error("Erro ao salvar na planilha:", error);
//     throw error;
//   }
// }

// async function iniciarBot() {
//   const mensagemBoasVindas =
//     "Olá! 👋\n\nSou o assistente virtual do Dr. Igor Rodrigues e estou aqui para te ajudar com o cadastro no processo da Holanda.\n\nVamos começar? Prometo que é rapidinho! 😊";
//   const perguntaNomeCompleto =
//     "1️⃣ Qual é o seu nome completo?\n(Por favor, informe exatamente como está no seu documento mais recente.)";
//   const perguntaCPF = "2️⃣ Por favor, me informe seu CPF, apenas os dígitos.";
//   const perguntaDataNascimento =
//     "3️⃣ Agora, me informe sua data de nascimento no formato DD/MM/AAAA.";

//   try {
//     const client = await venom.create({
//       session: "chatbot-wpp",
//       multidevice: true,
//       disableSpins: true,
//       headless: true,
//       browserArgs: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-extensions",
//         "--disable-gpu",
//         "--disable-dev-shm-usage",
//       ],
//       logQR: true,
//       autoClose: false,
//     });

//     client.onMessage(async (msg) => {
//       try {
//         if (msg.isGroupMsg) return;

//         const id = msg.from;
//         const userMessage = msg.body.toLowerCase();

//         // Resetar conversa se digitar "cancelar"
//         if (userMessage === "cancelar") {
//           delete estados[id];
//           await client.sendText(
//             id,
//             "Cadastro cancelado. Digite algo para começar novamente."
//           );
//           return;
//         }

//         if (!estados[id]) {
//           estados[id] = { etapa: "nome" };
//           await client.sendText(id, mensagemBoasVindas);
//           await client.sendText(id, perguntaNomeCompleto);
//           return;
//         }

//         const estado = estados[id];

//         if (estado.etapa === "nome") {
//           estado.nome = msg.body;
//           estado.etapa = "cpf";
//           await client.sendText(id, perguntaCPF);
//         } else if (estado.etapa === "cpf") {
//           // Validação simples do CPF
//           if (!/^\d{11}$/.test(msg.body)) {
//             await client.sendText(
//               id,
//               "CPF inválido. Por favor, digite os 11 números do CPF sem pontos ou traços."
//             );
//             return;
//           }
//           estado.cpf = msg.body;
//           estado.etapa = "nascimento"; // próxima etapa é nascimento
//           await client.sendText(id, perguntaDataNascimento);
//         } else if (estado.etapa === "nascimento") {
//           // Validação simples da data
//           if (!/^\d{2}\/\d{2}\/\d{4}$/.test(msg.body)) {
//             await client.sendText(
//               id,
//               "Formato inválido. Por favor, digite no formato DD/MM/AAAA"
//             );
//             return;
//           }
//           estado.nascimento = msg.body;

//           try {
//             await salvarNoSheets(estado.nome, estado.nascimento, estado.cpf);
//             await client.sendText(
//               id,
//               "✅ Cadastro finalizado com sucesso!\n\nNome: " +
//                 estado.nome +
//                 "\nNascimento: " +
//                 estado.nascimento +
//                 "\nCPF: " +
//                 estado.cpf
//             );
//           } catch (error) {
//             await client.sendText(
//               id,
//               "❌ Erro ao salvar seus dados. Por favor, tente novamente mais tarde."
//             );
//           }

//           delete estados[id];
//         }
//       } catch (error) {
//         console.error("Erro no processamento da mensagem:", error);
//       }
//     });

//     console.log("Bot iniciado com sucesso!");
//   } catch (error) {
//     console.error("Erro ao iniciar o bot:", error);
//     process.exit(1);
//   }
// }

// // Inicialização do sistema
// (async () => {
//   try {
//     await inicializarPlanilha();
//     await iniciarBot();
//   } catch (error) {
//     console.error("Falha na inicialização:", error);
//     process.exit(1);
//   }
// })();
