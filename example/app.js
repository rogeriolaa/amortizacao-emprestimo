// Importa da cópia local da biblioteca
import Amortizacao from "./amortizacao-emprestimo.js";

const form = document.getElementById("form-simulador");
const resultadoBox = document.getElementById("resultado");
const tbody = resultadoBox.querySelector("tbody");

// Modal elements
const modal = document.getElementById("modal-parcelas");
const modalTitle = document.getElementById("modal-title");
const modalTbody = document.getElementById("modal-tbody");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const exportarBtn = document.getElementById("exportar-csv");
const resumoFinanceiro = document.getElementById("resumo-financeiro");
const estatisticas = document.getElementById("estatisticas");

// Dados globais para exportação
let dadosAtivos = null;
let sistemaAtivo = "";

// Event listeners do modal
modalClose.addEventListener("click", fecharModal);
modalCancel.addEventListener("click", fecharModal);
modal.querySelector(".modal-background").addEventListener("click", fecharModal);
exportarBtn.addEventListener("click", exportarCSV);

// Tecla ESC para fechar modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-active")) {
    fecharModal();
  }
});

function abrirModal(sistema, dados) {
  dadosAtivos = dados;
  sistemaAtivo = sistema;

  modalTitle.textContent = `📊 ${sistema} - Cronograma Detalhado`;
  modalTbody.innerHTML = "";

  // Preencher tabela
  dados.parcelamento.forEach((parcela, index) => {
    const row = document.createElement("tr");
    row.className = "parcela-row";

    // Destacar primeira e última parcela
    if (index === 0) row.classList.add("has-background-success-light");
    if (index === dados.parcelamento.length - 1)
      row.classList.add("has-background-warning-light");

    row.innerHTML = `
      <td><strong>${parcela.mes}</strong></td>
      <td>${parcela.saldoInicial.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
      <td>${parcela.amortizacao.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
      <td>${parcela.juros.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
      <td><strong>${parcela.prestacao.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</strong></td>
      <td>${parcela.saldoFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
    `;

    modalTbody.appendChild(row);
  });

  // Calcular estatísticas
  const primeiraParcela = dados.parcelamento[0];
  const ultimaParcela = dados.parcelamento[dados.parcelamento.length - 1];
  const menorParcela = Math.min(...dados.parcelamento.map((p) => p.prestacao));
  const maiorParcela = Math.max(...dados.parcelamento.map((p) => p.prestacao));

  // Preencher resumo
  resumoFinanceiro.innerHTML = `
    <strong>Total de Juros:</strong> ${dados.totalJuros.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )}<br>
    <strong>Total Pago:</strong> ${dados.totalPago.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}<br>
    <strong>Economia vs PRICE:</strong> <span id="economia"></span>
  `;

  // Preencher estatísticas
  estatisticas.innerHTML = `
    <strong>Primeira Parcela:</strong> ${primeiraParcela.prestacao.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )}<br>
    <strong>Última Parcela:</strong> ${ultimaParcela.prestacao.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )}<br>
    <strong>Menor Parcela:</strong> ${menorParcela.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}<br>
    <strong>Maior Parcela:</strong> ${maiorParcela.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  `;

  modal.classList.add("is-active");
  document.body.classList.add("modal-open");
}

function fecharModal() {
  modal.classList.remove("is-active");
  document.body.classList.remove("modal-open");
}

function exportarCSV() {
  if (!dadosAtivos) return;

  const headers = [
    "Parcela",
    "Saldo Inicial",
    "Amortização",
    "Juros",
    "Prestação",
    "Saldo Final",
  ];
  let csvContent = headers.join(";") + "\n";

  dadosAtivos.parcelamento.forEach((parcela) => {
    const row = [
      parcela.mes,
      parcela.saldoInicial.toFixed(2).replace(".", ","),
      parcela.amortizacao.toFixed(2).replace(".", ","),
      parcela.juros.toFixed(2).replace(".", ","),
      parcela.prestacao.toFixed(2).replace(".", ","),
      parcela.saldoFinal.toFixed(2).replace(".", ","),
    ];
    csvContent += row.join(";") + "\n";
  });

  // Adicionar totais
  csvContent += "\n";
  csvContent += `Total de Juros;${dadosAtivos.totalJuros
    .toFixed(2)
    .replace(".", ",")}\n`;
  csvContent += `Total Pago;${dadosAtivos.totalPago
    .toFixed(2)
    .replace(".", ",")}\n`;

  // Download do arquivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `amortizacao_${sistemaAtivo.toLowerCase()}_${new Date().getTime()}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  tbody.innerHTML = "";

  const valor = parseFloat(document.getElementById("valor").value);
  const taxaAnual = parseFloat(document.getElementById("taxa").value) / 100;
  const prazo = parseInt(document.getElementById("prazo").value, 10);

  // Validação básica
  if (valor <= 0 || taxaAnual < 0 || prazo <= 0) {
    alert("❌ Por favor, insira valores válidos!");
    return;
  }

  // Calcular todos os sistemas
  const resultados = {};
  const sistemas = [
    ["SAC", () => Amortizacao.sac(valor, taxaAnual, prazo)],
    ["PRICE", () => Amortizacao.price(valor, taxaAnual, prazo)],
    ["SAM", () => Amortizacao.sam(valor, taxaAnual, prazo)],
  ];

  sistemas.forEach(([nome, calcular]) => {
    try {
      const resultado = calcular();
      resultados[nome] = resultado;

      const row = document.createElement("tr");

      // Destaque para o sistema mais econômico
      const isEconomico = nome === "SAC";
      const rowClass = isEconomico ? "has-background-success-light" : "";

      row.className = rowClass;
      row.innerHTML = `
        <td>
          <strong>${nome}</strong>
          ${
            isEconomico
              ? '<span class="tag is-success is-small ml-2">Mais Econômico</span>'
              : ""
          }
        </td>
        <td>${valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</td>
        <td>${resultado.parcelamento.length}</td>
        <td><strong>${resultado.totalPago.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</strong></td>
        <td>
          <button class="button is-small is-info" onclick="abrirDetalhes('${nome}')">
            👁️ Ver Detalhes
          </button>
        </td>
      `;

      tbody.appendChild(row);
    } catch (error) {
      console.error(`❌ Erro no cálculo ${nome}:`, error);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="5" class="has-text-danger">
          ❌ Erro no cálculo ${nome}: ${error.message}
        </td>
      `;
      tbody.appendChild(row);
    }
  });

  // Tornar resultados disponíveis globalmente
  window.resultadosGlobais = resultados;

  resultadoBox.style.display = "block";
  resultadoBox.scrollIntoView({ behavior: "smooth" });
});

// Função global para abrir detalhes
window.abrirDetalhes = function (sistema) {
  if (window.resultadosGlobais && window.resultadosGlobais[sistema]) {
    abrirModal(sistema, window.resultadosGlobais[sistema]);
  }
};

form.addEventListener("reset", () => {
  tbody.innerHTML = "";
  resultadoBox.style.display = "none";
  window.resultadosGlobais = null;
});

// Formatação automática no input de valor
document.getElementById("valor").addEventListener("blur", function (e) {
  const valor = parseFloat(e.target.value);
  if (!isNaN(valor)) {
    e.target.value = valor;
  }
});
