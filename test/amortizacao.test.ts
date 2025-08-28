// Importa diretamente do src, não do dist
import Amortizacao from "../src/index";

describe("Amortizacao", () => {
  const principal = 100000;
  const taxaAnual = 0.12;
  const prazo = 60;

  it("SAC: total de juros e total pago", () => {
    const { totalJuros, totalPago, parcelamento } = Amortizacao.sac(
      principal,
      taxaAnual,
      prazo
    );
    expect(parcelamento).toHaveLength(prazo);
    expect(totalJuros).toBeCloseTo(30500, 2);
    expect(totalPago).toBeCloseTo(130500, 2);
  });

  it("PRICE: total de juros e total pago", () => {
    const { totalJuros, totalPago } = Amortizacao.price(
      principal,
      taxaAnual,
      prazo
    );
    expect(totalJuros).toBeCloseTo(33466.69, 2);
    expect(totalPago).toBeCloseTo(133466.69, 2);
  });

  it("SAM: total de juros e total pago", () => {
    const { totalJuros, totalPago } = Amortizacao.sam(
      principal,
      taxaAnual,
      prazo
    );
    expect(totalJuros).toBeCloseTo(31983.34, 2);
    expect(totalPago).toBeCloseTo(131983.34, 2);
  });
});
