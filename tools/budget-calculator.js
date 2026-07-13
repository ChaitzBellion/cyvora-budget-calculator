const rupee = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const professionalTax = {
  Maharashtra: 200,
  Karnataka: 200,
  Telangana: 200,
  Delhi: 0,
  "Tamil Nadu": 208,
  Gujarat: 200,
  "West Bengal": 200,
  Other: 0,
};

const cityCosts = {
  Mumbai: { rent: 30000, food: 10000, transport: 4500, utilities: 4500, fresherAvg: 650000 },
  Delhi: { rent: 24000, food: 9000, transport: 4000, utilities: 4200, fresherAvg: 620000 },
  Bengaluru: { rent: 22000, food: 8000, transport: 3000, utilities: 3500, fresherAvg: 700000 },
  Pune: { rent: 18000, food: 7500, transport: 3000, utilities: 3200, fresherAvg: 580000 },
  Hyderabad: { rent: 17000, food: 7500, transport: 2800, utilities: 3200, fresherAvg: 600000 },
  Chennai: { rent: 17000, food: 7500, transport: 3000, utilities: 3300, fresherAvg: 560000 },
  Ahmedabad: { rent: 14000, food: 6500, transport: 2500, utilities: 2800, fresherAvg: 480000 },
  Kolkata: { rent: 13000, food: 6500, transport: 2400, utilities: 2700, fresherAvg: 460000 },
};

const roleMarket = {
  "Software Engineer": { avg: 1050000 },
  "Data Analyst": { avg: 850000 },
  "Product Designer": { avg: 900000 },
  "Marketing Associate": { avg: 650000 },
  "Finance Analyst": { avg: 750000 },
};

const $ = (id) => {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element with ID "${id}" not found.`);
    return el;
};
const value = (id) => Number($(id)?.value) || 0;
const checked = (id) => Boolean($(id)?.checked);
const money = (amount) => `${amount < 0 ? "-" : ""}₹${rupee.format(Math.abs(Math.round(amount)))}`;
const lpa = (amount) => `${(amount / 100000).toFixed(amount >= 1000000 ? 1 : 2)} LPA`;
const selectedRadio = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value;

function slabTax(taxable, slabs) {
  let tax = 0;
  let previous = 0;

  slabs.forEach(({ limit, rate }) => {
    if (taxable > previous) {
      tax += (Math.min(taxable, limit) - previous) * rate;
      previous = limit;
    }
  });

  return tax;
}

function runCalculation() {
    const model = computeSalaryModel(); // This is your math function
    updateSalaryUI(model);            // This updates the numbers
    updateCharts(model);              // This updates the graphs
}

function taxForRegime(regime, taxableSalary, oldDeductions) {
  if (regime === "new") {
    const taxable = Math.max(0, taxableSalary - 75000);
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];
    const beforeCess = taxable <= 1200000 ? 0 : slabTax(taxable, slabs);
    return { taxable, annualTax: beforeCess * 1.04 };
  }

  const taxable = Math.max(0, taxableSalary - 50000 - oldDeductions);
  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];
  const beforeCess = taxable <= 500000 ? 0 : slabTax(taxable, slabs);
  return { taxable, annualTax: beforeCess * 1.04 };
}

function salaryPartsFromGross(annualGross, annualCtc, options) {
  const annualBasic = annualGross * 0.4;
  const annualHra = annualBasic * 0.5;
  const annualMedical = Math.min(15000, annualGross * 0.02);
  const annualSpecial = Math.max(0, annualGross - annualBasic - annualHra - annualMedical);
  const employeePF = options.pfApplicable ? (annualBasic * 0.12) : 0;
  const employerPF = options.employerPfIncluded ? employeePF : 0;
  const bonus = options.bonusIncluded ? annualCtc * (options.bonusPercent / 100) : 0;
  const variable = options.variablePayIncluded ? annualCtc * (options.variablePercent / 100) : 0;
  const employerNps = options.employerNpsIncluded ? annualBasic * (options.employerNpsPercent / 100) : 0;
  const gratuity = options.pfApplicable ? annualBasic * 0.0481 : 0;

  return { annualBasic, annualHra, annualMedical, annualSpecial, employeePF, employerPF, bonus, variable, employerNps, gratuity };
}

function currentOptions() {
  const employmentType = $("employmentType").value;
  return {
    employmentType,
    pfApplicable: employmentType === "Full-time",
    employerPfIncluded: checked("employerPfIncluded"),
    bonusIncluded: checked("bonusIncluded"),
    variablePayIncluded: checked("variablePayIncluded"),
    employerNpsIncluded: checked("employerNpsIncluded"),
    bonusPercent: value("bonusPercent"),
    variablePercent: value("variablePercent"),
    employerNpsPercent: value("employerNpsPercent"),
  };
}

function solveGrossFromCtc(annualCtc, options) {
  let annualGross = annualCtc;

  for (let index = 0; index < 12; index += 1) {
    const parts = salaryPartsFromGross(annualGross, annualCtc, options);
    const included = parts.employerPF + parts.gratuity + parts.bonus + parts.variable + parts.employerNps;
    annualGross = Math.max(0, annualCtc - included);
  }

  return annualGross;
}

function computeSalaryModel(overrides = {}) {
  const basis = selectedRadio("ctcBasis");
  const options = currentOptions();
  let annualCtc = overrides.annualCtc ?? value("ctcAmount");
  let annualGross;

  if (!overrides.annualCtc && basis === "monthlyCtc") annualCtc *= 12;

  if (!overrides.annualCtc && basis === "monthlyGross") {
    annualGross = value("ctcAmount") * 12;
    let estimatedCtc = annualGross;
    for (let index = 0; index < 8; index += 1) {
      const parts = salaryPartsFromGross(annualGross, estimatedCtc, options);
      estimatedCtc = annualGross + parts.employerPF + parts.gratuity + parts.bonus + parts.variable + parts.employerNps;
    }
    annualCtc = estimatedCtc;
  } else {
    annualGross = solveGrossFromCtc(annualCtc, options);
  }

  const parts = salaryPartsFromGross(annualGross, annualCtc, options);
  const taxableSalary = annualGross + parts.bonus + parts.variable;
  const oldTax = taxForRegime("old", taxableSalary, value("oldDeductions"));
  const newTax = taxForRegime("new", taxableSalary, value("oldDeductions"));
  const regime = overrides.taxRegime ?? selectedRadio("taxRegime");
  const chosenTax = regime === "old" ? oldTax : newTax;
  const monthlyGross = annualGross / 12;
  const monthlyTax = chosenTax.annualTax / 12;
  const monthlyEmployeePF = parts.employeePF / 12;
  const monthlyPT = options.pfApplicable ? professionalTax[$("state").value] || 0 : 0;
  const monthlyInHand = Math.max(0, monthlyGross - monthlyTax - monthlyEmployeePF - monthlyPT);

  return {
    annualCtc,
    annualGross,
    monthlyGross,
    monthlyTax,
    monthlyEmployeePF,
    monthlyPT,
    monthlyInHand,
    taxableSalary,
    oldTax,
    newTax,
    chosenTax,
    regime,
    city: $("city").value,
    state: $("state").value,
    role: $("role").value,
    experience: value("experience"),
    options,
    ...parts,
  };
}

function healthScore(model) {
  const bestTax = Math.min(model.oldTax.annualTax, model.newTax.annualTax);
  const taxEfficient = model.chosenTax.annualTax <= bestTax + 1000;
  const variablePct = model.annualCtc ? (model.variable / model.annualCtc) * 100 : 0;
  const bonusPct = model.annualCtc ? (model.bonus / model.annualCtc) * 100 : 0;
  const city = cityCosts[model.city];
  const livingCost = city.rent + city.food + city.transport + city.utilities;
  const savingsPotential = model.monthlyInHand - livingCost;


  let score = 55;

  if (taxEfficient) score += 15;
  if (model.employeePF > 0) score += 10;
  if (savingsPotential > model.monthlyInHand * 0.25) score += 12;
  if (variablePct <= 20) score += 4;
  if (bonusPct <= 15) score += 2;
  if (model.employerNps > 0 || model.employeePF > 0) score += 2;
  if (variablePct > 25) score -= 8;
  if (savingsPotential < 0) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function stars(score) {
  const filled = Math.max(1, Math.round(score / 20));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

function row(label, amount, negative = false) {
  return `<div class="split-row"><span>${label}</span><strong>${negative ? "-" : ""}${money(amount)}</strong></div>`;
}

function updateSalaryUI(model) {
  const score = healthScore(model);
  const city = cityCosts[model.city];
  const costTotal = city.rent + city.food + city.transport + city.utilities;
  const estimatedSavings = model.monthlyInHand - costTotal;
  const taxSavings = Math.abs(model.oldTax.annualTax - model.newTax.annualTax);
  const betterRegime = model.oldTax.annualTax < model.newTax.annualTax ? "Old Regime" : "New Regime";

  $("monthlyInHand").textContent = money(model.monthlyInHand);
  $("resultGross").textContent = money(model.monthlyGross);
  $("resultTax").textContent = `-${money(model.monthlyTax)}`;
  $("resultEmployeePf").textContent = `-${money(model.monthlyEmployeePF)}`;
  $("resultProfessionalTax").textContent = `-${money(model.monthlyPT)}`;
  $("resultNet").textContent = money(model.monthlyInHand);

  $("salaryHealthScore").textContent = score;
  $("salaryStars").textContent = stars(score);
  $("healthFactors").innerHTML = ["Tax Efficiency", "PF Contribution", "Savings Potential", "Variable Pay %", "Bonus %", "Retirement Planning"]
    .map((item) => `<li>${item}</li>`)
    .join("");

  $("breakdownRows").innerHTML = [
    row("Basic Pay", model.annualBasic / 12),
    row("HRA", model.annualHra / 12),
    row("Special Allowance", model.annualSpecial / 12),
    row("Medical", model.annualMedical / 12),
    row("Bonus", model.bonus / 12),
    row("Variable Pay", model.variable / 12),
    row("Employer PF", model.employerPF / 12),
    row("Employer NPS", model.employerNps / 12),
    row("Gratuity", model.gratuity / 12),
  ].join("");

  $("oldTaxValue").textContent = money(model.oldTax.annualTax);
  $("newTaxValue").textContent = money(model.newTax.annualTax);
  $("taxSavingsValue").textContent = money(taxSavings);
  $("taxWhy").textContent = `${betterRegime} is better based on current inputs. Old regime depends on deductions like 80C, HRA, NPS, insurance, and loan interest.`;

  $("costRent").textContent = money(city.rent);
  $("costFood").textContent = money(city.food);
  $("costTransport").textContent = money(city.transport);
  $("costUtilities").textContent = money(city.utilities);
  $("costSavings").textContent = money(estimatedSavings);

  updateInsights(model, score, estimatedSavings, betterRegime, taxSavings);
  updatePlanning(model, estimatedSavings, costTotal);
  updateOfferComparison(model);
  updateGrowth(model);
}

function updateInsights(model, score, estimatedSavings, betterRegime, taxSavings) {
  const city = cityCosts[model.city];
  const role = roleMarket[model.role];
  const insights = [];

  insights.push(model.annualCtc >= city.fresherAvg
    ? `Your salary places you above the common fresher range for ${model.city}.`
    : `Your salary is below the common fresher range for ${model.city}; focus on skills and negotiation.`);
  insights.push(estimatedSavings > 0
    ? `You can comfortably invest around ${money(Math.max(0, estimatedSavings * 0.4))}/month after estimated city expenses.`
    : `Your estimated cost of living is higher than monthly in-hand. Reduce fixed costs before increasing investments.`);
  insights.push(`${betterRegime} saves approximately ${money(taxSavings)}/year compared with the other regime.`);
  insights.push(model.annualCtc >= role.avg
    ? `For ${model.role}, your salary is above the estimated benchmark of ${lpa(role.avg)}.`
    : `For ${model.role}, the estimated benchmark is ${lpa(role.avg)}, leaving room for a potential raise.`);

  $("aiInsights").innerHTML = insights.map((item) => `<li>${item}</li>`).join("");

  const recommendations = [];
  if (score >= 85) recommendations.push("Good salary structure.");
  if (model.chosenTax.annualTax <= Math.min(model.oldTax.annualTax, model.newTax.annualTax) + 1000) recommendations.push("Tax optimized.");
  if (model.variable / model.annualCtc <= 0.2) recommendations.push("Variable pay is healthy.");
  if (model.employeePF > 0) recommendations.push(`Increase PF by ${money(500)} if retirement planning is your priority.`);
  if (estimatedSavings > 0) recommendations.push(`Automate SIP of ${money(Math.max(1000, estimatedSavings * 0.4))}/month.`);

  $("recommendations").innerHTML = recommendations.map((item) => `<li>${item}</li>`).join("");
}

function updatePlanning(model, estimatedSavings, costTotal) {
  $("planEmergency").textContent = money(costTotal * 6);
  $("planSip").textContent = money(Math.max(0, estimatedSavings * 0.4));
  $("planGold").textContent = money(Math.max(0, estimatedSavings * 0.08));
  $("planTerm").textContent = money(Math.max(10000000, model.annualCtc * 15));
  $("planHealth").textContent = "₹15 Lakh";
  $("planNote").textContent = "These are planning estimates, not investment, tax, or insurance advice.";
}

function updateOfferComparison(model) {
  if (document.activeElement !== $("currentOffer")) $("currentOffer").value = (model.annualCtc / 100000).toFixed(1);
  if (document.activeElement !== $("growthCurrent")) $("growthCurrent").value = (model.annualCtc / 100000).toFixed(1);

  const offers = [
    { name: "Current Offer", ctc: value("currentOffer") * 100000 },
    { name: "Offer A", ctc: value("offerA") * 100000 },
    { name: "Offer B", ctc: value("offerB") * 100000 },
  ].map((offer) => {
    const computed = computeSalaryModel({ annualCtc: offer.ctc });
    return { ...offer, monthlyInHand: computed.monthlyInHand, annualTax: computed.chosenTax.annualTax, score: healthScore(computed) };
  });

  const bestOverall = offers.reduce((best, item) => (item.score > best.score ? item : best), offers[0]);

  $("offerResults").innerHTML = offers.map((offer) => `
    <article class="offer-card ${offer.name === bestOverall.name ? "best" : ""}">
      <span>${offer.name}</span>
      <strong>${lpa(offer.ctc)}</strong>
      <p>Monthly in-hand: ${money(offer.monthlyInHand)}</p>
      <p>Annual tax: ${money(offer.annualTax)}</p>
      <small>${offer.name === bestOverall.name ? "Best Overall" : ""}</small>
    </article>
  `).join("");
}

function updateGrowth() {
  const start = value("growthCurrent") * 100000;
  const hike = value("expectedHike") / 100;
  const years = Math.max(1, value("projectionYears"));
  const rows = [];
  let salary = start;
  let total = 0;

  for (let year = 1; year <= years; year += 1) {
    if (year > 1) salary *= 1 + hike;
    total += salary;
    rows.push({ year, salary });
  }

  $("totalCareerEarnings").textContent = money(total);
  $("growthRows").innerHTML = rows.map((item) => `
    <div class="projection-row">
      <span>Year ${item.year}</span>
      <strong>${lpa(item.salary)}</strong>
    </div>
  `).join("");
}

function updateAmountLabel() {
  const basis = selectedRadio("ctcBasis");

  if (basis === "annual") {
    $("amountLabel").textContent = "Annual CTC";
    $("amountHint").textContent = "Enter yearly cost to company.";
  } else if (basis === "monthlyCtc") {
    $("amountLabel").textContent = "Monthly CTC";
    $("amountHint").textContent = "Enter monthly cost to company.";
  } else {
    $("amountLabel").textContent = "Monthly Gross Salary";
    $("amountHint").textContent = "Enter fixed monthly gross salary before deductions.";
  }
}

function updateApp() {
  updateAmountLabel();
  updateSalaryUI(computeSalaryModel());
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    element.addEventListener("input", updateApp);
    element.addEventListener("change", updateApp);
  });

  $("calculateBtn").addEventListener("click", updateApp);
  $("downloadReportBtn").addEventListener("click", () => window.print());
  updateApp();
});

// 1. Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    
    const calculateBtn = document.getElementById('calculateBtn');

    if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        // Since math is already done in real-time, 
        // this button now acts as the primary PDF download.
        window.print(); 
    });
}

    // 3. Attach to the button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', runCalculation);
    }

    // 4. (Optional) Auto-calculate on input change
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
                  const model = computeSalaryModel();
        updateSalaryUI(model);
        updateCharts(model); // This ensures graphs move as the user types
        });
    });
});


/* --- Add this at the end of budget-calculator.js --- */

// This function initializes all button interactions
function initApp() {
    const calculateBtn = document.getElementById('calculateBtn');
    const downloadBtn = document.getElementById('downloadReportBtn');

    // Action 1: The Calculate Button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            console.log("Calculating...");
            const model = computeSalaryModel(); // Runs your math
            updateSalaryUI(model);            // Updates the screen
            // C. GENERATE THE GRAPHS (The 3rd Step)
            updateCharts(model);
            console.log("UI and Graphs updated!");
            // Start the app logic
            document.addEventListener('DOMContentLoaded', initApp);
        });
    }

    // Action 2: The Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            window.print(); // Opens the print/save-as-pdf dialog
        });
    }
}

// Ensure the code runs only after the HTML is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


// 1. Define an object to hold your chart instances globally
let myCharts = {}; 

function updateCharts(model) {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { padding: 15, usePointStyle: true }
            }
        }
    };

    const chartConfigs = [
        {
            id: 'componentChart',
            type: 'doughnut',
            data: {
                labels: ['Basic Pay', 'HRA', 'Allowance', 'Bonus'],
                datasets: [{
                    data: [model.annualBasic, model.annualHra, model.annualSpecial, model.bonus],
                    backgroundColor: ['#1e8a6a', '#10b981', '#34d399', '#f59e0b']
                }]
            },
            options: commonOptions
        },
        {
            id: 'deductionChart',
            type: 'bar',
            data: {
                labels: ['Income Tax', 'Provident Fund', 'Prof. Tax'],
                datasets: [{
                    label: 'Monthly Deductions',
                    data: [model.monthlyTax, model.monthlyEmployeePF, model.monthlyPT],
                    backgroundColor: ['#ef4444', '#0ea5e9', '#6366f1']
                }]
            },
            options: { ...commonOptions, scales: { y: { beginAtZero: true } } }
        },
        {
            id: 'growthChart', // FIX: Added the missing 3rd chart
            type: 'line',
            data: {
                labels: ['Current', 'Year 1', 'Year 2', 'Year 3', 'Year 4'],
                datasets: [{
                    label: 'Projected Growth',
                    data: [model.annualCtc, model.annualCtc * 1.1, model.annualCtc * 1.21, model.annualCtc * 1.33, model.annualCtc * 1.46],
                    borderColor: '#10b981',
                    fill: false
                }]
            },
            options: { ...commonOptions, scales: { y: { beginAtZero: true } } }
        }
    ];

    chartConfigs.forEach(config => {
        const canvas = document.getElementById(config.id);
        if (!canvas) return;

        // CRITICAL: Destroy the old chart instance if it exists
        if (myCharts[config.id]) {
            myCharts[config.id].destroy();
        }

        // Create the new chart instance
        myCharts[config.id] = new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: config.options
        });
    });
}

// Add this to the bottom of budget-calculator.js
document.addEventListener('DOMContentLoaded', () => {
  const ctcInput = document.getElementById('ctcAmount');
  const plannerContainer = document.querySelector('.planner');
  const dashboard = document.querySelector('.dashboard');

  const updateVisibility = () => {
    const val = ctcInput.value;
    // Show results only if CTC is entered and greater than 0
    if (val && parseFloat(val) > 0) {
      plannerContainer.classList.add('results-active');
    } else {
      plannerContainer.classList.remove('results-active');
    }
  };

  // Listen for typing and changes
  ctcInput.addEventListener('input', updateVisibility);
  
  // Run once on load in case the browser auto-filled the values
  updateVisibility();
});