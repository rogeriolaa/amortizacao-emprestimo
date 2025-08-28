import fs from "fs/promises";
import path from "path";

async function copyToExample() {
  try {
    const source = path.join("dist", "index.esm.js");
    const destination = path.join("example", "amortizacao-emprestimo.js");

    await fs.copyFile(source, destination);
    console.log("✅ Biblioteca copiada para example/amortizacao-emprestimo.js");
  } catch (error) {
    console.error("❌ Erro ao copiar arquivo:", error);
    process.exit(1);
  }
}

copyToExample();
