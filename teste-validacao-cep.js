// Teste da validação de CEP
console.log("🧪 Testando validação de CEP...");

function testarCEP(cep) {
  // Simula a lógica do endereco.js
  const cepLimpo = cep.replace(/\D/g, ""); // Remove caracteres não numéricos
  const valido = /^\d{8}$/.test(cepLimpo);

  console.log(`CEP: "${cep}" -> Limpo: "${cepLimpo}" -> Válido: ${valido}`);
  return valido;
}

// Testes
console.log("\n📋 Testando formatos válidos:");
testarCEP("12345-678"); // Deve ser válido
testarCEP("12345678"); // Deve ser válido
testarCEP("01234-567"); // Deve ser válido
testarCEP("01234567"); // Deve ser válido

console.log("\n❌ Testando formatos inválidos:");
testarCEP("1234-567"); // Deve ser inválido (7 dígitos)
testarCEP("123456789"); // Deve ser inválido (9 dígitos)
testarCEP("12345-67a"); // Deve ser inválido (letra)
testarCEP("abcde-fgh"); // Deve ser inválido (letras)
testarCEP("12345"); // Deve ser inválido (5 dígitos)
testarCEP(""); // Deve ser inválido (vazio)

console.log("\n✅ Teste concluído!");
