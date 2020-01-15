const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
  return renderPlaintText(invoice, plays);
}

function renderPlaintText(invoice, pays) {

  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order 
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`; 
  }

  result += `Amount owed is ${usd(totalAmount(invoice))}\n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
  return result;

  function totalAmount(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
      // print line for this order 
      result += amountFor(perf);
    }
    return result;
  }
  
  function totalVolumeCredits(invoice) {
    let result = 0;
    for (let performances of invoice.performances) {
      result += volumeCreditsFor(performances);
    }
    return result;
  }
  
  function usd(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(number/100);
  }
  
  function volumeCreditsFor(performances) {
      result = 0;
      // add volume credits 
      result += Math.max(performances.audience - 30, 0); 
      // add extra credit for every ten comedy attendees 
      if ("comedy" === playFor(performances).type) 
        result += Math.floor(performances.audience / 5);
  
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
}

console.log(statement(invoices, plays));