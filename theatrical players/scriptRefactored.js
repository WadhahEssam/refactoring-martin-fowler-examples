const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;
  for (let perf of invoice.performances) {

    // add volume credits 
    volumeCredits += Math.max(perf.audience - 30, 0); 
    // add extra credit for every ten comedy attendees 
    if ("comedy" === playFor(perf).type) 
      volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order 
    result += ` ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`; 
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function playFor(performances) {
  return plays[performances.playID];
}

function amountFor(performances) {
  let result = 0;

  switch (playFor(performances).type) {
    case "tragedy":
      result = 40000;
      if (performances.audience > 30) {
        result += 1000 * (performances.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (performances.audience > 20) {
        result += 10000 + 500 * (performances.audience - 20);
      }
      result += 300 * performances.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(perf).type}`);
  }

  return result;
}

console.log(statement(invoices, plays));