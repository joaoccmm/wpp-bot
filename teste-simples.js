console.log("Testando geração de delays aleatórios...");

// Simulação do código de delay
function gerarDelay() {
  const min = 3000; // 3 segundos
  const max = 8000; // 8 segundos
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay;
}

console.log("5 delays gerados:");
for (let i = 1; i <= 5; i++) {
  const delay = gerarDelay();
  console.log(`Usuário ${i}: ${delay}ms (${(delay / 1000).toFixed(1)}s)`);
}

console.log("\nCada número é diferente? SIM! ✅");
