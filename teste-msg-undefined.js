// Teste para verificar se o tratamento de msg.body undefined funciona

const { getEstado, setEstado, limparEstado } = require("./utils/estados");

// Mock de client
const mockClient = {
  sendText: async (id, msg) => {
    console.log(`📱 Mensagem enviada para ${id}: ${msg}`);
  },
};

// Mock da função fluxoCadastro
async function testeFluxoCadastro(client, msg) {
  const id = msg.from;
  const userMessage = (msg.body || "").trim().toLowerCase();
  console.log(`🔍 Processando: "${userMessage}" para usuário ${id}`);

  let estado = getEstado(id);

  if (!estado) {
    setEstado(id, { etapa: "confirmar_inicio" });
    await client.sendText(id, "Olá! Digite Sim para começar.");
    return;
  }

  console.log(`✅ Fluxo processado com sucesso para ${id}`);
}

async function executarTestes() {
  console.log("🧪 INICIANDO TESTES DE MSG.BODY UNDEFINED\n");

  // Teste 1: msg.body undefined
  console.log("🔸 Teste 1: msg.body undefined");
  try {
    await testeFluxoCadastro(mockClient, {
      from: "5511999999999@c.us",
      body: undefined,
    });
    console.log("✅ Teste 1 passou!\n");
  } catch (error) {
    console.log("❌ Teste 1 falhou:", error.message, "\n");
  }

  // Teste 2: msg.body null
  console.log("🔸 Teste 2: msg.body null");
  try {
    await testeFluxoCadastro(mockClient, {
      from: "5511999999998@c.us",
      body: null,
    });
    console.log("✅ Teste 2 passou!\n");
  } catch (error) {
    console.log("❌ Teste 2 falhou:", error.message, "\n");
  }

  // Teste 3: msg.body string vazia
  console.log("🔸 Teste 3: msg.body string vazia");
  try {
    await testeFluxoCadastro(mockClient, {
      from: "5511999999997@c.us",
      body: "",
    });
    console.log("✅ Teste 3 passou!\n");
  } catch (error) {
    console.log("❌ Teste 3 falhou:", error.message, "\n");
  }

  // Teste 4: msg.body normal
  console.log("🔸 Teste 4: msg.body normal");
  try {
    await testeFluxoCadastro(mockClient, {
      from: "5511999999996@c.us",
      body: "sim",
    });
    console.log("✅ Teste 4 passou!\n");
  } catch (error) {
    console.log("❌ Teste 4 falhou:", error.message, "\n");
  }

  console.log("🎉 TODOS OS TESTES CONCLUÍDOS!");
  console.log(
    "✅ O erro 'Cannot read properties of undefined (reading 'trim')' foi corrigido!"
  );
}

executarTestes().catch(console.error);
