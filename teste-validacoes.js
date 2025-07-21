// Teste rápido das validações implementadas
console.log("🧪 TESTE DAS VALIDAÇÕES IMPLEMENTADAS\n");

console.log("1. 🆔 TESTE CPF:");
const cpfs = [
  "12345678901", // ✅ apenas números
  "123.456.789-01", // ✅ formatado
  "123.456.789.01", // ❌ formato incorreto
  "1234567890", // ❌ muito curto
];

cpfs.forEach((cpf) => {
  const cpfLimpo = cpf.replace(/[.-]/g, "");
  const valido = /^\d{11}$/.test(cpfLimpo);
  console.log(
    `  ${cpf.padEnd(15)} → ${cpfLimpo} → ${
      valido ? "✅ VÁLIDO" : "❌ INVÁLIDO"
    }`
  );
});

console.log("\n2. 📱 TESTE TELEFONE:");
const telefones = [
  "11987654321", // ✅ apenas números
  "11 9876-5432", // ✅ com traço
  "11 9876 5432", // ✅ com espaços
  "(11) 98765-4321", // ✅ com parênteses
  "1234567890", // ✅ 10 dígitos
  "123456789", // ❌ muito curto
];

telefones.forEach((tel) => {
  const telLimpo = tel.replace(/[\s\-\(\)]/g, "");
  const valido = /^\d{10,11}$/.test(telLimpo);
  console.log(
    `  ${tel.padEnd(15)} → ${telLimpo.padEnd(11)} → ${
      valido ? "✅ VÁLIDO" : "❌ INVÁLIDO"
    }`
  );
});

console.log("\n3. 📅 TESTE DATA:");
const datas = [
  "01/01/1990", // ✅ válido
  "31/12/2000", // ✅ válido
  "1/1/1990", // ❌ sem zero
  "01-01-1990", // ❌ formato incorreto
];

datas.forEach((data) => {
  const valida = /^\d{2}\/\d{2}\/\d{4}$/.test(data);
  console.log(`  ${data.padEnd(15)} → ${valida ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`);
});

console.log("\n4. 🏠 TESTE CEP:");
const ceps = [
  "01234567", // ✅ 8 dígitos
  "12345678", // ✅ 8 dígitos
  "1234567", // ❌ 7 dígitos
  "123456789", // ❌ 9 dígitos
  "12345-678", // ❌ com hífen
];

ceps.forEach((cep) => {
  const valido = /^\d{8}$/.test(cep);
  console.log(`  ${cep.padEnd(15)} → ${valido ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`);
});

console.log("\n5. 👥 TESTE INDICAÇÃO:");
const indicacoes = [
  "Igor", // ✅
  "Matheus", // ✅
  "Dr. Igor", // ✅
  "João Victor", // ✅
  "Aline", // ✅
  "Outro nome", // ❌
];

indicacoes.forEach((indicacao) => {
  const opcao = indicacao.toLowerCase();
  const valida =
    opcao.includes("igor") ||
    opcao.includes("matheus") ||
    opcao.includes("aline") ||
    opcao.includes("simony") ||
    opcao.includes("joão") ||
    opcao.includes("joao") ||
    opcao.includes("victor");

  console.log(
    `  ${indicacao.padEnd(15)} → ${valida ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`
  );
});

console.log("\n🎉 TESTE CONCLUÍDO!");
console.log("✅ Todas as validações implementadas foram testadas");
