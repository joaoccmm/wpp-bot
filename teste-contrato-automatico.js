// Teste para verificar fluxo do contrato automatizado
const { fluxoPerguntas } = require("./flows/fluxoPerguntas");
const { obterEstado, setEstado } = require("./utils/estados");

// Mock do cliente
const mockClient = {
  sendMessage: async (id, message) => {
    console.log(`📤 Enviando mensagem para ${id}:`);
    console.log(message);
    console.log("---");
    return Promise.resolve();
  },
  sendFile: async (id, file, filename, caption) => {
    console.log(`📎 Enviando arquivo para ${id}:`);
    console.log(`Arquivo: ${file}`);
    console.log(`Nome: ${filename}`);
    console.log(`Legenda: ${caption}`);
    console.log("---");
    return Promise.resolve();
  },
};

async function testarFluxoContrato() {
  const id = "teste-contrato-automatico@c.us";

  // Resetar estado
  setEstado(id, {});

  console.log("🧪 TESTE: Fluxo de contrato automatizado");
  console.log("=".repeat(50));

  // Simular estado antes do documento verso
  setEstado(id, {
    nome: "João Silva",
    etapa3: "documento_verso",
    documentos: true,
    documentoFrente: true,
  });

  console.log("\n1️⃣ Simulando envio do documento verso...");

  try {
    // Simular mensagem de documento (qualquer texto/arquivo)
    await fluxoPerguntas(mockClient, {
      from: id,
      body: "documento_verso.jpg", // Simula arquivo
      type: "image",
    });

    console.log("\n✅ Teste concluído!");
    console.log("\n📊 Estado final:");
    console.log(JSON.stringify(obterEstado(id), null, 2));
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

// Executar teste
testarFluxoContrato().catch(console.error);
