import Decimal from "decimal.js";

/**
 * Representa uma parcela individual do cronograma de amortização
 */
export interface Parcela {
  /** Número sequencial do mês (1, 2, 3...) */
  mes: number;
  /** Saldo devedor no início do período */
  saldoInicial: number;
  /** Valor da amortização (principal) pago no período */
  amortizacao: number;
  /** Valor dos juros pagos no período */
  juros: number;
  /** Valor total da prestação (amortização + juros) */
  prestacao: number;
  /** Saldo devedor restante após o pagamento */
  saldoFinal: number;
}

/**
 * Resultado completo do cálculo de amortização
 */
export interface Resultado {
  /** Array com todas as parcelas do financiamento */
  parcelamento: Parcela[];
  /** Soma total de todos os juros pagos */
  totalJuros: number;
  /** Valor total pago ao final do financiamento */
  totalPago: number;
}

/**
 * Classe principal para cálculos de amortização de empréstimos
 *
 * @example
 * ```
 * const resultado = Amortizacao.sac(100000, 0.12, 60);
 * console.log(`Total pago: R$ ${resultado.totalPago.toFixed(2)}`);
 * ```
 */
export default class Amortizacao {
  /**
   * Converte taxa de juros anual para taxa mensal equivalente
   *
   * @param taxaAnual - Taxa anual em decimal (ex: 0.12 para 12%)
   * @returns Taxa mensal equivalente em Decimal
   *
   * @example
   * ```
   * const taxaMensal = Amortizacao.taxaMensal(0.12);
   * console.log(taxaMensal.toNumber());
   * ```
   */
  static taxaMensal(taxaAnual: number): Decimal {
    return new Decimal(taxaAnual).plus(1).pow(new Decimal(1).div(12)).minus(1);
  }

  /**
   * Calcula amortização pelo Sistema SAC (Sistema de Amortização Constante)
   *
   * @param principal - Valor principal do empréstimo em reais, maior que zero
   * @param taxaAnual - Taxa de juros anual em decimal (0.12 = 12%)
   * @param n - Número de parcelas (períodos em meses), maior que zero
   * @throws {Error} Se algum parâmetro for inválido
   * @returns Resultado completo com cronograma e totais
   *
   * @example
   * ```
   * const sac = Amortizacao.sac(100000, 0.12, 60);
   * console.log(sac.totalPago);
   * ```
   */
  static sac(principal: number, taxaAnual: number, n: number): Resultado {
    if (principal <= 0) throw new Error("Principal deve ser maior que zero");
    if (taxaAnual < 0) throw new Error("Taxa anual não pode ser negativa");
    if (n <= 0) throw new Error("Número de parcelas deve ser maior que zero");

    const p = new Decimal(principal);
    const i = Amortizacao.taxaMensal(taxaAnual);
    const nroParcelas = new Decimal(n);
    const amortConstante = p.dividedBy(nroParcelas);
    let saldo = p;
    const parcelamento: Parcela[] = [];
    let totalJuros = new Decimal(0);
    let totalPago = new Decimal(0);

    for (let mes = 1; mes <= n; mes++) {
      const juros = saldo.times(i);
      const prestacao = amortConstante.plus(juros);
      const novoSaldo = saldo.minus(amortConstante);

      parcelamento.push({
        mes,
        saldoInicial: saldo.toNumber(),
        amortizacao: amortConstante.toNumber(),
        juros: juros.toNumber(),
        prestacao: prestacao.toNumber(),
        saldoFinal: novoSaldo.toNumber(),
      });

      totalJuros = totalJuros.plus(juros);
      totalPago = totalPago.plus(prestacao);
      saldo = novoSaldo;
    }

    return {
      parcelamento,
      totalJuros: totalJuros.toNumber(),
      totalPago: totalPago.toNumber(),
    };
  }

  /**
   * Calcula amortização pelo Sistema PRICE (Sistema Francês)
   *
   * @param principal Valor principal do empréstimo em reais, maior que zero
   * @param taxaAnual Taxa de juros anual em decimal (0.12 = 12%)
   * @param n Número de parcelas (meses), maior que zero
   * @throws {Error} Se algum parâmetro for inválido
   * @returns Resultado completo com cronograma e totais
   *
   * @example
   * ```
   * const price = Amortizacao.price(100000, 0.12, 60);
   * console.log(price.totalPago);
   * ```
   */
  static price(principal: number, taxaAnual: number, n: number): Resultado {
    if (principal <= 0) throw new Error("Principal deve ser maior que zero");
    if (taxaAnual < 0) throw new Error("Taxa anual não pode ser negativa");
    if (n <= 0) throw new Error("Número de parcelas deve ser maior que zero");

    const p = new Decimal(principal);
    const i = Amortizacao.taxaMensal(taxaAnual);
    const nroParcelas = new Decimal(n);

    const pow = i.plus(1).pow(nroParcelas);
    const fator = i.times(pow).dividedBy(pow.minus(1));
    const prestConstante = p.times(fator);

    let saldo = p;
    const parcelamento: Parcela[] = [];
    let totalJuros = new Decimal(0);
    let totalPago = new Decimal(0);

    for (let mes = 1; mes <= n; mes++) {
      const juros = saldo.times(i);
      const amortizacao = prestConstante.minus(juros);
      const novoSaldo = saldo.minus(amortizacao);

      parcelamento.push({
        mes,
        saldoInicial: saldo.toNumber(),
        amortizacao: amortizacao.toNumber(),
        juros: juros.toNumber(),
        prestacao: prestConstante.toNumber(),
        saldoFinal: novoSaldo.toNumber(),
      });

      totalJuros = totalJuros.plus(juros);
      totalPago = totalPago.plus(prestConstante);
      saldo = novoSaldo;
    }

    return {
      parcelamento,
      totalJuros: totalJuros.toNumber(),
      totalPago: totalPago.toNumber(),
    };
  }

  /**
   * Calcula amortização pelo Sistema SAM (Misto)
   *
   * A prestação é a média simples das prestações SAC e PRICE.
   *
   * @param principal Valor principal do empréstimo em reais, maior que zero
   * @param taxaAnual Taxa de juros anual em decimal (0.12 = 12%)
   * @param n Número de parcelas (meses), maior que zero
   * @throws {Error} Se algum parâmetro for inválido
   * @returns Resultado completo com cronograma e totais
   *
   * @example
   * ```
   * const sam = Amortizacao.sam(100000, 0.12, 60);
   * console.log(sam.totalPago);
   * ```
   */
  static sam(principal: number, taxaAnual: number, n: number): Resultado {
    if (principal <= 0) throw new Error("Principal deve ser maior que zero");
    if (taxaAnual < 0) throw new Error("Taxa anual não pode ser negativa");
    if (n <= 0) throw new Error("Número de parcelas deve ser maior que zero");

    const sacRes = Amortizacao.sac(principal, taxaAnual, n);
    const priceRes = Amortizacao.price(principal, taxaAnual, n);

    let saldo = new Decimal(principal);
    const parcelamento: Parcela[] = [];
    let totalJuros = new Decimal(0);
    let totalPago = new Decimal(0);

    for (let idx = 0; idx < n; idx++) {
      const prestSac = new Decimal(sacRes.parcelamento[idx].prestacao);
      const prestPrice = new Decimal(priceRes.parcelamento[idx].prestacao);
      const juros = saldo.times(Amortizacao.taxaMensal(taxaAnual));
      const prestSam = prestSac.plus(prestPrice).dividedBy(2);
      const amortizacao = prestSam.minus(juros);
      const novoSaldo = saldo.minus(amortizacao);

      parcelamento.push({
        mes: idx + 1,
        saldoInicial: saldo.toNumber(),
        amortizacao: amortizacao.toNumber(),
        juros: juros.toNumber(),
        prestacao: prestSam.toNumber(),
        saldoFinal: novoSaldo.toNumber(),
      });

      totalJuros = totalJuros.plus(juros);
      totalPago = totalPago.plus(prestSam);
      saldo = novoSaldo;
    }

    return {
      parcelamento,
      totalJuros: totalJuros.toNumber(),
      totalPago: totalPago.toNumber(),
    };
  }
}
