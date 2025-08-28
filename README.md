# Amortização de Empréstimo

Um projeto completo para simulação e cálculo de financiamentos utilizando os principais sistemas de amortização usados no Brasil: **SAC**, **PRICE** e **SAM**. Desenvolvido em TypeScript/JavaScript, com interface web amigável para visualização, exportação e comparação dos resultados.

## Publicação NPM

Este projeto será publicado como pacote NPM:  
**[@n0n3br/amortizacao-emprestimo](https://www.npmjs.com/package/@n0n3br/amortizacao-emprestimo)**  
Você poderá instalar e utilizar como dependência em seus projetos (Node.js/TypeScript/Web).

```bash
npm install @n0n3br/amortizacao-emprestimo
```

## Funcionalidades

- **Cálculo de Amortização**: Simule financiamentos informando valor, taxa de juros anual e número de parcelas.
- **Suporte aos principais sistemas**:
  - **SAC (Sistema de Amortização Constante)**: Parcelas decrescentes, menor pagamento total de juros.
  - **PRICE (Sistema Francês de Amortização)**: Parcelas fixas, fácil planejamento.
  - **SAM (Sistema de Amortização Mista)**: Média simples das parcelas SAC e PRICE.
- **Cronograma Detalhado**: Visualize mês a mês:
  - Saldo inicial
  - Valor amortizado
  - Juros pagos
  - Prestação
  - Saldo final
- **Resumo Financeiro**:
  - Total de juros pagos
  - Total pago ao final do financiamento
  - Economia comparativa entre sistemas
- **Estatísticas**:
  - Primeira, última, menor e maior parcela
- **Comparativo automático**: Destaca o sistema mais econômico (normalmente SAC).
- **Exportação para CSV**: Gere relatórios dos cronogramas detalhados.
- **Interface Web (exemplo)**:
  - Simulador com validação de dados
  - Modal de detalhes das parcelas
  - Navegação fluida e intuitiva
- **Exemplo de uso em código**:
  - O projeto pode ser usado como biblioteca TypeScript/JavaScript para cálculos em aplicações próprias.

## Como usar

### Via Web (Exemplo)

A aplicação da pasta `example` serve apenas para demonstrar as funcionalidades da biblioteca. **Não é destinada para uso em produção**!  
Abra `example/index.html` no navegador para testar.

1. Informe:
   - Valor do empréstimo
   - Taxa anual de juros (em %)
   - Número de parcelas (meses)
2. Clique em **Simular**.
3. Veja o comparativo dos sistemas, detalhes das parcelas e exporte o cronograma.

### Como biblioteca TypeScript/JavaScript (Uso recomendado)

```typescript
import Amortizacao from "@n0n3br/amortizacao-emprestimo";

// SAC
const resultadoSAC = Amortizacao.sac(100000, 0.12, 60);
console.log("Total pago SAC:", resultadoSAC.totalPago);

// PRICE
const resultadoPRICE = Amortizacao.price(100000, 0.12, 60);
console.log("Total pago PRICE:", resultadoPRICE.totalPago);

// SAM
const resultadoSAM = Amortizacao.sam(100000, 0.12, 60);
console.log("Total pago SAM:", resultadoSAM.totalPago);
```

### Estrutura dos resultados

Cada cálculo retorna um objeto com:

- `parcelamento`: Array de parcelas, cada uma com:
  - `mes`: número do mês
  - `saldoInicial`: saldo devedor inicial
  - `amortizacao`: valor amortizado
  - `juros`: juros pagos
  - `prestacao`: valor da prestação
  - `saldoFinal`: saldo devedor após pagamento
- `totalJuros`: soma total dos juros pagos
- `totalPago`: valor total pago ao final do financiamento

## Tecnologias

- TypeScript / JavaScript
- HTML / CSS
- Exemplo interativo usando [Bulma CSS](https://bulma.io/)
- [decimal.js](https://github.com/MikeMcl/decimal.js/) para precisão matemática

## Contribuição

Sugestões, melhorias e correções são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## Licença

MIT

---

**Autor:** [Rogerio Amorim](https://github.com/rogeriolaa)
