// Teste completo do fluxo
const { setEstado, getEstado, limparEstado } = require("./utils/estados");

// Simulando um estado completo após cadastro e endereço
const testUserId = "test123@whatsapp";

function simularFluxoCompleto() {
  // Limpar estado anterior
  limparEstado(testUserId);

  // Simular estado após cadastro e endereço
  const estadoCompleto = {
    // Dados do cadastro
    nome: "João Silva Teste",
    nascimento: "15/05/1990",
    cpf: "12345678900",
    telefone: "11999887766",
    email: "joao.teste@email.com",

    // Dados do endereço
    cep: "01000000",
    rua: "Rua das Flores",
    numero: "123",
    bairro: "Centro",
    complemento: "Apto 45",

    // Estado do fluxo
    etapa: "perguntas",
    etapa3: "inicio",

    // Respostas das perguntas (simulando que já foram respondidas)
    menorIdade: "Não",
    pergunta1: "Sim",
    pergunta2: "Não",
    pergunta3: "Sim",
    pergunta5: "Sim",
    pergunta6: "a,b,c",
    pergunta7: "Diagnóstico teste - 01/01/2020",
    pergunta8: "a,d",
    pergunta9: "Não",
    pergunta10: "",
    pergunta11: "",
    pergunta12: "Sim",
    pergunta13: "b,e,g",
    pergunta14: "Sim",
    pergunta15: "a,c",
    pergunta16: "Mudei em março de 2021",
    pergunta17: "Não",
    pergunta18: "a,b",
  };

  setEstado(testUserId, estadoCompleto);

  console.log("✅ Estado completo simulado criado:");
  console.log(JSON.stringify(estadoCompleto, null, 2));

  // Verificar se o estado foi salvo corretamente
  const estadoRecuperado = getEstado(testUserId);
  console.log("\n🔍 Estado recuperado:");
  console.log(JSON.stringify(estadoRecuperado, null, 2));

  return estadoRecuperado;
}

// Executar teste
const estado = simularFluxoCompleto();

console.log("\n📊 Verificações:");
console.log("- Tem nome?", !!estado.nome);
console.log("- Tem CPF?", !!estado.cpf);
console.log("- Tem endereço?", !!estado.cep && !!estado.rua);
console.log("- Está no fluxo de perguntas?", estado.etapa === "perguntas");
console.log(
  "- Tem respostas das perguntas?",
  !!estado.pergunta1 && !!estado.pergunta18
);

console.log("\n🎯 Estado pronto para teste no fluxo real!");
