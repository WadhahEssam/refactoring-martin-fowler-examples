const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);


  function enrichPerformance(aPerformance) { 
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    return result; 
  }

  function playFor(performances) {
    return plays[performances.playID];
  }

  return renderPlaintText(statementData, plays);
}


function renderPlaintText(data, pays) {

  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    // print line for this order 
    result += ` ${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`; 
  }

  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      // print line for this order 
      result += amountFor(perf);
    }
    return result;
  }
  
  function totalVolumeCredits() {
    let result = 0;
    for (let performances of data.performances) {
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
  
  function volumeCreditsFor(performance) {
      result = 0;
      // add volume credits 
      result += Math.max(performance.audience - 30, 0); 
      // add extra credit for every ten comedy attendees 
      if ("comedy" === performance.play.type) 
        result += Math.floor(performance.audience / 5);
  
      return result;
  }
  
  function amountFor(performance) {
    let result = 0;
  
    switch (performance.play.type) {
      case "tragedy":
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${performance.play.type}`);
    }
  
    return result;
  }
}

console.log(statement(invoices, plays));