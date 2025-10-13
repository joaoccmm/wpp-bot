// Teste completo simulando um usuário passando por todo o questionário

const { getEstado, setEstado, limparEstado } = require("./utils/estados");

// Simular um estado progressivo como se o usuário fosse avançando
function testarProgressaoCompleta() {
  console.log("🧪 Testando progressão completa do questionário...");

  const id = "usuario-teste-completo";

  // Estado inicial (cadastro + endereço)
  let estado = {
    etapa: "perguntas",
    etapa3: "inicio",
    // Dados do cadastro
    nome: "Maria Silva",
    cpf: "12345678901",
    nascimento: "15/05/1980",
    telefone: "11987654321",
    email: "maria@teste.com",
    // Dados do endereço
    cep: "01234567",
    rua: "Rua das Flores",
    numero: "123",
    complemento: "Apto 45",
    bairro: "Centro",
  };

  console.log("📋 Estado inicial (cadastro + endereço):", {
    nome: estado.nome,
    cpf: estado.cpf,
    cep: estado.cep,
    etapa: estado.etapa,
    etapa3: estado.etapa3,
  });

  // Simular progressão através das seções

  // 1. Seção de saúde
  estado.saudeProblemas = true;
  estado.saudeTipos = ["Problemas de pele", "Dor de barriga"];
  estado.saudeOutros = "Dores de cabeça";
  estado.saudeContinua = true;
  estado.saudeQuando = {
    mes: "03",
    ano: "2023",
    descricao: "Começou no início do ano",
  };
  estado.saudeDiagnostico = true;
  estado.saudeDiagnosticoQual = "Dermatite alérgica";
  estado.saudeRenda = true;
  estado.saudeRendaContinua = false;

  console.log("✅ Simulando seção de saúde preenchida");

  // 2. Seção emocional
  estado.emocionalProblemas = true;
  estado.emocionalTipos = ["Ansiedade", "Depressão"];
  estado.emocionalOutros = "Insônia";
  estado.emocionalQuando = { mes: "04", ano: "2023" };
  estado.emocionalExiste = true;
  estado.emocionalAtrapalhou = true;
  estado.emocionalAtestado = false;
  estado.emocionalGastos = 800;

  console.log("✅ Simulando seção emocional preenchida");

  // 3. Seção de bens
  estado.bensPerda = true;
  estado.bensTipos = ["Casa", "Carro"];
  estado.bensValorAntes = 200000;
  estado.bensValorDepois = 50000;
  estado.bensQuando = { mes: "05", ano: "2023" };

  console.log("✅ Simulando seção de bens preenchida");

  // 4. Seção mudança
  estado.mudancaCasa = true;
  estado.mudancaMotivo = ["Destruição da casa", "Problemas de saúde"];
  estado.mudancaOutros = "Contaminação do solo";
  estado.mudancaQuando = { mes: "06", ano: "2023" };
  estado.mudancaVoltou = false;
  estado.mudancaMoradia = "Alugada";
  estado.mudancaGastos = true;

  console.log("✅ Simulando seção de mudança preenchida");

  // 5. Seção alimentação
  estado.alimentacaoFonte = true;
  estado.alimentacaoQuando = { mes: "07", ano: "2023" };
  estado.alimentacaoSemFonte = true;
  estado.alimentacaoGastos = ["Compra de água", "Compra de alimentos"];
  estado.alimentacaoOutros = "Filtros especiais";
  estado.alimentacaoValor = 500;

  console.log("✅ Simulando seção de alimentação preenchida");

  // 6. Seção custo de vida
  estado.custoVidaAumento = true;
  estado.custoVidaTipos = ["Medicamentos", "Transporte"];
  estado.custoVidaQuando = { mes: "08", ano: "2023" };
  estado.custoVidaValor = 300;

  console.log("✅ Simulando seção de custo de vida preenchida");

  // 7. Seção renda
  estado.rendaPrejuizo = true;
  estado.rendaMotivos = ["Doença", "Mudança"];
  estado.rendaQuando = { mes: "09", ano: "2023" };
  estado.rendaValor = 2000;

  console.log("✅ Simulando seção de renda preenchida");

  // 8. Seção água
  estado.aguaProblemas = true;
  estado.aguaTipos = ["Cor alterada", "Gosto ruim"];
  estado.aguaContinua = true;
  estado.aguaTempo = "Há 2 anos";
  estado.aguaGastos = ["Compra de água", "Filtros"];
  estado.aguaOutros = "Análises laboratoriais";
  estado.aguaValor = 200;

  console.log("✅ Simulando seção de água preenchida");

  // 9. Seção rio/terra
  estado.rioTerraRio = true;
  estado.rioTerraTerra = true;
  estado.rioTerraUsos = ["Pesca", "Agricultura"];
  estado.rioTerraOutros = "Criação de animais";
  estado.rioTerraQuando = { mes: "10", ano: "2023" };

  console.log("✅ Simulando seção rio/terra preenchida");

  // 10. Seção indenização
  estado.indenizacaoProcesso = false;
  estado.indenizacaoRecebidas = [];
  estado.indenizacaoQuando = { mes: "", ano: "" };
  estado.indenizacaoCadastrado = true;
  estado.indenizacaoContato = true;

  console.log("✅ Simulando seção de indenização preenchida");

  // 11. Documentos
  estado.documentoFrente = true;
  estado.documentoVerso = true;

  console.log("✅ Simulando documentos enviados");

  // 12. Contrato
  estado.contratoAceito = true;
  estado.textoAutorizacao =
    "Eu Maria Silva, li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome.";
  estado.indicadoPor = "Dr. Igor";

  console.log("✅ Simulando contrato aceito e indicação preenchida");

  // Salvar estado final
  setEstado(id, estado);

  console.log("\n📊 ESTADO FINAL COMPLETO:");
  console.log("- saudeProblemas:", estado.saudeProblemas);
  console.log("- saudeTipos:", estado.saudeTipos);
  console.log("- emocionalProblemas:", estado.emocionalProblemas);
  console.log("- emocionalTipos:", estado.emocionalTipos);
  console.log("- bensPerda:", estado.bensPerda);
  console.log("- bensTipos:", estado.bensTipos);
  console.log("- aguaProblemas:", estado.aguaProblemas);
  console.log("- aguaTipos:", estado.aguaTipos);
  console.log("- contratoAceito:", estado.contratoAceito);
  console.log("- indicadoPor:", estado.indicadoPor);

  // Verificar se o estado foi salvo corretamente
  const estadoRecuperado = getEstado(id);
  console.log("\n🔍 Verificando estado recuperado...");
  if (estadoRecuperado && estadoRecuperado.saudeProblemas === true) {
    console.log("✅ Estado salvo e recuperado corretamente!");
  } else {
    console.log("❌ Problema no salvamento/recuperação do estado");
  }

  return estado;
}

const estadoTeste = testarProgressaoCompleta();
