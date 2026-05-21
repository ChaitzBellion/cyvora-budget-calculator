const rupee = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const fields = [
  "city",
  "income",
  "otherIncome",
  "rent",
  "emis",
  "food",
  "transport",
  "subscriptions",
  "savings",
  "investments",
  "increment",
  "returnRate",
  "inflationRate",
];

const cityCosts = {
  Mumbai: { min: 35000, max: 60000 },
  Delhi: { min: 33000, max: 50000 },
  Bengaluru: { min: 33000, max: 50000 },
  Pune: { min: 33000, max: 45000 },
  Hyderabad: { min: 32000, max: 50000 },
  Chennai: { min: 31000, max: 50000 },
  Ahmedabad: { min: 22000, max: 43000 },
  Kolkata: { min: 20000, max: 40000 },
};

const palette = {
  needs: "#1e8a6a",
  debt: "#d85f48",
  savings: "#3478b8",
  investments: "#d99a25",
  lifestyle: "#6f5fb8",
};

function value(id) {
  return Number(document.getElementById(id).value) || 0;
}

function money(amount) {
  return `Rs. ${rupee.format(Math.max(0, amount))}`;
}

function monthlyInvestmentFutureValue(monthlyAmount, annualRate, years, incrementRate) {
  const monthlyRate = annualRate / 100 / 12;
  let futureValue = 0;
  let sip = monthlyAmount;

  for (let month = 1; month <= years * 12; month += 1) {
    futureValue = (futureValue + sip) * (1 + monthlyRate);
    if (month % 12 === 0) {
      sip *= 1 + incrementRate / 100;
    }
  }

  return futureValue;
}

function adjustForInflation(futureValue, inflationRate, years) {
  return futureValue / Math.pow(1 + inflationRate / 100, years);
}

function calculateFireStatus(investments, savingsRate, income, debtRate, needs, debt, lifestyle) {
  // Calculate actual monthly expenses
  const monthlyExpenses = needs + debt + lifestyle;
  const annualExpenses = monthlyExpenses * 12;
  
  // FIRE corpus = 25 × annual expenses (safe withdrawal rate of 4%)
  const fireCorpus = annualExpenses * 25;
  
  // Calculate wealth path assuming 20 years of investing
  const currentCorpus = monthlyInvestmentFutureValue(investments, 12, 20, 8);
  const yearsToFire = currentCorpus >= fireCorpus ? 0 : Math.ceil(fireCorpus / (investments * 12 * 12));
  
  return {
    requiredCorpus: fireCorpus,
    currentPath: currentCorpus,
    yearsUntilFire: yearsToFire === 0 ? "Now!" : yearsToFire,
    percentage: Math.min(100, Math.round((currentCorpus / fireCorpus) * 100)),
    monthlyExpenses: monthlyExpenses
  };
}

function addBar(label, amount, total, color) {
  const percent = total ? Math.min(100, (amount / total) * 100) : 0;
  return `
    <div class="bar-row">
      <div class="bar-top">
        <span>${label}</span>
        <span>${money(amount)} - ${percent.toFixed(0)}%</span>
      </div>
      <div class="track">
        <div class="fill" style="width:${percent}%; background:${color}"></div>
      </div>
    </div>
  `;
}

function calculate() {
  const selectedCity = document.getElementById("city").value;
  const cityCost = cityCosts[selectedCity];
  const income = value("income") + value("otherIncome");
  const needs = value("rent") + value("food") + value("transport");
  const debt = value("emis");
  const monthlyInvestments = value("investments");
  const lifestyle = value("subscriptions");
  const currentSavings = value("savings"); // This is TOTAL savings, not monthly
  
  // Monthly committed expenses (NOT including current savings!)
  const committed = needs + debt + monthlyInvestments + lifestyle;
  const safeSpend = income - committed;
  
  // For savings rate: use current savings as indicator of their wealth building
  const savingsRate = income ? ((currentSavings + monthlyInvestments) / income) * 100 : 0;
  const debtRate = income ? (debt / income) * 100 : 0;
  const needsRate = income ? (needs / income) * 100 : 0;

  let score = 0;
  score += Math.min(25, savingsRate * 1.2);
  score -= Math.max(0, debtRate - 15) * 1.4;
  score -= Math.max(0, needsRate - 55) * 0.9;
  score -= safeSpend < 0 ? 18 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  document.getElementById("score").textContent = score;
  document.getElementById("scoreLabel").textContent =
    score >= 80 ? "Strong control" : score >= 60 ? "Good, with room" : "Needs attention";
  document.getElementById("safeSpend").textContent = money(safeSpend);
  
  if (income === 0) {
    document.getElementById("cityName").textContent = "--";
    document.getElementById("cityRange").textContent = "--";
    document.getElementById("cityStatus").textContent = "Enter income to see city fit";
  } else {
    document.getElementById("cityName").textContent = selectedCity;
    document.getElementById("cityRange").textContent = `${money(cityCost.min)} - ${money(cityCost.max)}`;

    let cityStatus = "Your income fits this city's starter comfort range.";
    if (income < cityCost.min) {
      cityStatus = `Income is below the typical ${selectedCity} comfort range by ${money(cityCost.min - income)}.`;
    } else if (income > cityCost.max) {
      cityStatus = `Income is above the typical ${selectedCity} comfort range by ${money(income - cityCost.max)}. Good scope for investing.`;
    }
    document.getElementById("cityStatus").textContent = cityStatus;
  }

  document.getElementById("bars").innerHTML = [
    addBar("Needs", needs, income, palette.needs),
    addBar("Debt", debt, income, palette.debt),
    addBar("Monthly Investments", monthlyInvestments, income, palette.investments),
    addBar("Lifestyle", lifestyle, income, palette.lifestyle),
  ].join("");

  const insights = [];
  const targetSavings = income * 0.2;
  const emergencyFund = needs * 6;
  
  // Get these values early (needed for calculations below)
  const annualReturn = value("returnRate");
  const increment = value("increment");
  const inflationRate = value("inflationRate") || 6;

  if (safeSpend < 0) {
    insights.push(`Your plan is short by ${money(Math.abs(safeSpend))}. Reduce flexible spending or pause non-essential subscriptions first.`);
  } else {
    insights.push(`Your safe monthly spending limit is ${money(safeSpend)} after covering core bills, savings and investments.`);
  }

  if (income < cityCost.min) {
    insights.push(`${selectedCity} usually needs at least ${money(cityCost.min)} per month for a basic comfortable budget. Keep rent and lifestyle tight until income grows.`);
  } else if (income <= cityCost.max) {
    insights.push(`Your income sits inside the expected ${selectedCity} range of ${money(cityCost.min)} to ${money(cityCost.max)}. Budget discipline matters more than aggressive lifestyle upgrades here.`);
  } else {
    insights.push(`You are above the expected ${selectedCity} range. This is where automatic SIP increases and emergency fund building can create real advantage.`);
  }

  if (savings + monthlyInvestments < targetSavings) {
    insights.push(`Try moving toward a 20% wealth-building rate. Your current gap is about ${money(targetSavings - currentSavings - monthlyInvestments)} per month.`);
  } else {
    insights.push(`You are already crossing the 20% saving and investing benchmark. Keep this automated before spending starts.`);
  }

  if (debtRate > 20) {
    insights.push(`EMIs are taking ${debtRate.toFixed(0)}% of income. Prioritize high-interest debt before increasing lifestyle expenses.`);
  }

  if (lifestyle > income * 0.05) {
    insights.push(`Subscriptions are above 5% of income. A quick audit here can free cash without changing your lifestyle much.`);
  }

  insights.push(`Aim for an emergency fund of ${money(emergencyFund)}, equal to six months of rent, food and transport.`);

  // Investment Strategy Analysis
  const investmentRate = monthlyInvestments > 0 ? (monthlyInvestments / (currentSavings + monthlyInvestments)) * 100 : 0;
  if (monthlyInvestments > 0) {
    insights.push(`Your SIP of ${money(monthlyInvestments)} is ${investmentRate.toFixed(0)}% of your wealth-building pool. At 12% returns, this grows to ${money(monthlyInvestmentFutureValue(monthlyInvestments, 12, 5, 8))} in 5 years.`);
  }

  // Tax Optimization Hint
  const deductibleLimit = 150000; // Section 80C limit
  const annualInvestment = monthlyInvestments * 12;
  if (annualInvestment > 0) {
    const taxSavingsPotential = Math.min(annualInvestment, deductibleLimit) * 0.3; // Assume 30% tax bracket
    insights.push(`💡 Tax tip: Your annual SIP of ${money(annualInvestment)} can save up to ${money(taxSavingsPotential)} in taxes via Section 80C (ELSS, PPF, etc.).`);
  }

  // FIRE Explanation
  const fireCorpus = (needs + debt + lifestyle) * 12 * 25;
  const monthlyPassive = (fireCorpus * 0.04) / 12;
  insights.push(`📚 FIRE explained: You need ${money(fireCorpus)} (25× your annual expenses) to retire safely. With 4% withdrawal rate, this generates ${money(monthlyPassive)}/month PASSIVE income - without working! Example: ₹37L invested earning 12% returns, withdrawing only 4% yearly = ₹12,336 monthly forever.`);

  // Inflation & Real Value Explanation
  const futureValueExample = income * 5;
  const realValueExample = futureValueExample / Math.pow(1 + inflationRate / 100, 10);
  insights.push(`💰 Understanding "Real Value": Your projected wealth seems huge, but inflation erodes it. Example: ${money(futureValueExample)} after 10 years with ${inflationRate}% inflation = ${money(realValueExample)} in TODAY'S purchasing power. A coffee costing ₹100 today may cost ₹179 in 10 years!`);

   document.getElementById("insights").innerHTML = insights
    .map((item) => `<li>${item}</li>`)
    .join("");

  const futureValueTen = monthlyInvestmentFutureValue(monthlyInvestments, annualReturn, 10, increment);
  const futureValueTwenty = monthlyInvestmentFutureValue(monthlyInvestments, annualReturn, 20, increment);
  
  const realValueTen = adjustForInflation(futureValueTen, inflationRate, 10);
  const realValueTwenty = adjustForInflation(futureValueTwenty, inflationRate, 20);
  
  document.getElementById("futureTen").textContent = money(futureValueTen);
  document.getElementById("futureTenReal").textContent = `${money(realValueTen)} (real value)`;
  document.getElementById("futureTwenty").textContent = money(futureValueTwenty);
  document.getElementById("futureTwentyReal").textContent = `${money(realValueTwenty)} (real value)`;
  
  // FIRE Calculation
  const fireStatus = calculateFireStatus(monthlyInvestments, savingsRate, income, debtRate, needs, debt, lifestyle);
  const fireInsight = `<strong>🎯 FIRE Progress: ${fireStatus.percentage}%</strong><br>
    <div class="progress-bar"><div class="progress-fill" style="width:${fireStatus.percentage}%"></div></div>
    <small style="color: #64716e; font-size: 0.85rem;">
      <strong>Goal (to retire):</strong> ${money(fireStatus.requiredCorpus)}<br>
      <strong>Your path (in 20 years):</strong> ${money(fireStatus.currentPath)}<br>
      💡 This shows where your ₹${investments}/month SIP will grow to<br>
      ${fireStatus.yearsUntilFire === "Now!" ? "🎉 You're on track!" : `⏳ ~${fireStatus.yearsUntilFire} years at this rate`}
    </small>`;
  document.getElementById("fireInfo").innerHTML = fireInsight;
  
  // Emergency Fund Tracker
  const emergencyGoal = emergencyFund;
  const currentEmergency = currentSavings; // Use current savings as emergency fund
  let emergencyPercent = emergencyGoal > 0 ? Math.round((currentEmergency / emergencyGoal) * 100) : 0;
  let emergencyStatus = "";
  
  if (emergencyPercent >= 100) {
    emergencyStatus = `✅ <strong>Goal Complete!</strong> You have ${money(currentEmergency - emergencyGoal)} extra cushion.`;
    emergencyPercent = 100;
  } else {
    emergencyStatus = `📍 Progress: ${money(currentEmergency)} / ${money(emergencyGoal)}`;
  }
  
  const emergencyInsight = `<strong>🚨 Emergency Fund: ${emergencyPercent}%</strong><br>
    <div class="progress-bar"><div class="progress-fill" style="width:${emergencyPercent}%"></div></div>
    ${emergencyStatus}<br>
    <small style="color: #64716e;">Goal: ${money(emergencyGoal)} (6 months needs)</small>`;
  document.getElementById("emergencyInfo").innerHTML = emergencyInsight;
}

fields.forEach((id) => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("focus", () => {
      element.style.borderColor = "var(--mint)";
    });
    element.addEventListener("blur", () => {
      element.style.borderColor = "var(--line)";
    });
  }
});

document.getElementById("submitBtn").addEventListener("click", calculate);

calculate();
