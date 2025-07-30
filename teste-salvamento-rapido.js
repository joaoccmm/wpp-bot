const { salvarNoSheets } = require("./google/sheets");

console.log("🚀 Teste rápido - salvamento direto...");

async function testeSalvamento() {
  try {
    const dadosTeste = {
      timestamp: new Date().toISOString(),
      id: "5511999999999@c.us",
      nome: "teste definitvo bot",
      cpf: "123.456.789-00",
      nascimento: "01/01/1980",
      telefone: "(11) 99999-9999",
      email: "teste@email.com",
      cep: "12345-678",
      rua: "Rua Teste",
      numero: "123",
      complemento: "Apto 1",
      bairro: "Bairro Teste",
      saude_problemas: "true",
      saude_tipos: "Problemas respiratórios; Dores de cabeça",
      saude_outros: "Problemas de pele",
      saude_continua: "true",
      saude_quando_mes: "11",
      saude_quando_ano: "2015",
      saude_quando_descricao: "Logo após o rompimento",
      saude_diagnostico: "true",
      saude_diagnostico_qual: "Rinite alérgica",
      saude_renda_afetou: "true",
      saude_renda_continua: "true",
      emocional_problemas: "true",
      emocional_tipos: "Depressão; Ansiedade",
      emocional_outros: "Insônia",
      emocional_quando_mes: "12",
      emocional_quando_ano: "2015",
      emocional_existe: "true",
      emocional_atrapalhou: "true",
      emocional_atestado: "false",
      emocional_gastos: "500",
      bens_perda: "true",
      bens_tipos: "Casa; Veículo; Móveis",
      bens_valor_antes: "150000",
      bens_valor_depois: "50000",
      bens_quando_mes: "11",
      bens_quando_ano: "2015",
      bens_perda_valor: "100000",
      mudanca_casa: "true",
      mudanca_motivo: "Destruição da casa; Contaminação",
      mudanca_outros: "Área ficou perigosa",
      mudanca_quando_mes: "12",
      mudanca_quando_ano: "2015",
      mudanca_voltou: "false",
      mudanca_moradia_tipo: "Casa alugada",
      mudanca_gastos: "true",
      alimentacao_fonte_perda: "true",
      alimentacao_quando_mes: "11",
      alimentacao_quando_ano: "2015",
      alimentacao_sem_fonte: "true",
      alimentacao_gastos_tipos: "Compra de água; Compra de alimentos",
      alimentacao_outros: "Suplementos alimentares",
      alimentacao_valor_mensal: "800",
      custo_vida_aumento: "true",
      custo_vida_tipos: "Moradia; Transporte; Alimentação",
      custo_vida_quando_mes: "01",
      custo_vida_quando_ano: "2016",
      custo_vida_valor_mensal: "1200",
      renda_prejudicada: "true",
      renda_motivos: "Perda do emprego; Problemas de saúde",
      renda_quando_mes: "11",
      renda_quando_ano: "2015",
      renda_valor_perdido: "2500",
      agua_problemas: "true",
      agua_tipos: "Qualidade da água; Interrupção do fornecimento",
      agua_continua: "true",
      agua_tempo_descricao: "Desde o rompimento até hoje",
      agua_gastos_tipos: "Compra de água mineral; Filtros",
      agua_outros: "Análises de qualidade",
      agua_valor_mensal: "300",
      rio_terra_perdeu_rio: "true",
      rio_terra_perdeu_terra: "true",
      rio_terra_usos: "Pesca; Agricultura; Lazer",
      rio_terra_outros: "Criação de animais",
      rio_terra_quando_mes: "11",
      rio_terra_quando_ano: "2015",
      indenizacao_processou: "true",
      indenizacao_tipos_recebidas: "Auxílio emergencial; Indenização inicial",
      indenizacao_quando_mes: "06",
      indenizacao_quando_ano: "2016",
      indenizacao_cadastrado: "true",
      indenizacao_foi_contatado: "true",
      status: "teste_completo",
      observacoes:
        "Teste completo do sistema - todos os campos preenchidos para validação",
    };

    console.log("💾 Salvando dados...");
    await salvarNoSheets(dadosTeste);

    console.log("✅ SUCESSO! Dados salvos na planilha");
    console.log("📊 Nome testado: teste definitvo bot");
    console.log("🔢 Total de campos:", Object.keys(dadosTeste).length);
  } catch (error) {
    console.error("❌ ERRO:", error.message);
  }
}

testeSalvamento();
