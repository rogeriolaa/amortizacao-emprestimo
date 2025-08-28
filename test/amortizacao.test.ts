import Amortizacao from "../src/index";

describe("Amortizacao com decimal.js - testes ajustados", () => {
  const principal = 100000;
  const taxaAnual = 0.12;
  const prazo = 60;

  describe("Método SAC", () => {
    it("calculando totais e cronograma com precisão decimal", () => {
      const { parcelamento, totalJuros, totalPago } = Amortizacao.sac(
        principal,
        taxaAnual,
        prazo
      );

      expect(parcelamento.length).toBe(prazo);

      expect(parcelamento[0].saldoInicial).toBeCloseTo(principal, 2);
      expect(parcelamento[prazo - 1].saldoFinal).toBeCloseTo(0, 2);

      const amortConst = parcelamento[0].amortizacao;
      parcelamento.forEach((p) => {
        expect(p.amortizacao).toBeCloseTo(amortConst, 4);
      });

      for (let i = 1; i < prazo; i++) {
        expect(parcelamento[i].juros).toBeLessThanOrEqual(
          parcelamento[i - 1].juros + 1e-4
        );
        expect(parcelamento[i].prestacao).toBeLessThanOrEqual(
          parcelamento[i - 1].prestacao + 1e-4
        );
      }

      expect(totalJuros).toBeCloseTo(28940.81845, 5);
      expect(totalPago).toBeCloseTo(principal + totalJuros, 5);
    });
  });

  describe("Método PRICE", () => {
    it("prestacoes fixas e totais calculados corretamente", () => {
      const { parcelamento, totalJuros, totalPago } = Amortizacao.price(
        principal,
        taxaAnual,
        prazo
      );

      expect(parcelamento.length).toBe(prazo);

      const prestRef = parcelamento[0].prestacao;
      parcelamento.forEach((p) => {
        expect(p.prestacao).toBeCloseTo(prestRef, 5);
      });

      expect(parcelamento[prazo - 1].saldoFinal).toBeCloseTo(0, 2);

      expect(totalJuros).toBeCloseTo(31614.17522, 5);
      expect(totalPago).toBeCloseTo(principal + totalJuros, 5);
    });
  });

  describe("Método SAM", () => {
    it("totais coerentes entre SAC e PRICE", () => {
      const { parcelamento, totalJuros, totalPago } = Amortizacao.sam(
        principal,
        taxaAnual,
        prazo
      );

      expect(parcelamento.length).toBe(prazo);

      expect(parcelamento[prazo - 1].saldoFinal).toBeCloseTo(0, 2);

      expect(totalJuros).toBeGreaterThan(28940);
      expect(totalJuros).toBeLessThan(31615);

      expect(totalPago).toBeGreaterThan(principal + 28940);
      expect(totalPago).toBeLessThan(principal + 31615);
    });
  });

  describe("Validações", () => {
    it("lança erros com entrada inválida", () => {
      expect(() => Amortizacao.sac(0, taxaAnual, prazo)).toThrow();
      expect(() => Amortizacao.price(principal, -0.1, prazo)).toThrow();
      expect(() => Amortizacao.sam(principal, taxaAnual, 0)).toThrow();
    });
  });
});
