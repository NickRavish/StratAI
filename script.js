let useCases = JSON.parse(localStorage.getItem("useCases")) || [];

let scoreChart;
let priorityChart;
let impactWeight = 0.35;
let dataWeight = 0.25;
let alignmentWeight = 0.20;
let riskWeight = 0.10;
let complexityWeight = 0.10;

function calculateScore(impact, data, complexity, risk, alignment) {
    return (
        impactWeight * impact +
        dataWeight * data +
        alignmentWeight * alignment +
        riskWeight * (6 - risk) +
        complexityWeight * (6 - complexity)
    );
}


function addUseCase() {

    const name = document.getElementById("name").value;
    const impact = parseInt(document.getElementById("impact").value);
    const data = parseInt(document.getElementById("data").value);
    const complexity = parseInt(document.getElementById("complexity").value);
    const risk = parseInt(document.getElementById("risk").value);
    const alignment = parseInt(document.getElementById("alignment").value);

    if (!name || !impact || !data || !complexity || !risk || !alignment) {
        alert("Please fill all fields.");
        return;
    }

    const score = calculateScore(impact, data, complexity, risk, alignment);

    let priority;
    if (score >= 4.3) priority = "High";
    else if (score >= 3.5) priority = "Medium";
    else priority = "Low";

    useCases.push({ name, score, priority });

    localStorage.setItem("useCases", JSON.stringify(useCases));

    displayResults();
}

function deleteUseCase(index) {
    useCases.splice(index, 1);
    localStorage.setItem("useCases", JSON.stringify(useCases));
    displayResults();
}

function clearAll() {
    useCases = [];
    localStorage.removeItem("useCases");
    displayResults();
}

function displayResults() {

    const results = document.getElementById("results");
    const roadmap = document.getElementById("roadmap");
    const summary = document.getElementById("summary");

    results.innerHTML = "";
    roadmap.innerHTML = "";
    summary.innerHTML = "";

    useCases.sort((a, b) => b.score - a.score);

    let phase1 = [];
    let phase2 = [];
    let phase3 = [];

    useCases.forEach((u, index) => {

        let priorityClass;
        if (u.priority === "High") {
            priorityClass = "high";
            phase1.push(u.name);
        } 
        else if (u.priority === "Medium") {
            priorityClass = "medium";
            phase2.push(u.name);
        } 
        else {
            priorityClass = "low";
            phase3.push(u.name);
        }

        results.innerHTML += `
            <div class="result-item">
                <strong>${u.name}</strong>
                - Score: ${u.score.toFixed(2)}
                - Priority: <span class="${priorityClass}">${u.priority}</span>
                <button onclick="deleteUseCase(${index})">Delete</button>
            </div>
        `;
    });

    roadmap.innerHTML += `
        <div>
            <h3>Phase 1 – Immediate Implementation</h3>
            <p>${phase1.length ? phase1.join(", ") : "None"}</p>

            <h3>Phase 2 – Mid-Term Expansion</h3>
            <p>${phase2.length ? phase2.join(", ") : "None"}</p>

            <h3>Phase 3 – Long-Term / Experimental</h3>
            <p>${phase3.length ? phase3.join(", ") : "None"}</p>
        </div>
    `;

    if (useCases.length > 0) {
        summary.innerHTML = `
            <div>
            Based on quantitative prioritization analysis, 
            ${phase1.length ? phase1.join(", ") : "no initiatives"} 
            are recommended for Phase 1 implementation due to strong business impact and alignment. 
            ${phase2.length ? phase2.join(", ") : "No mid-term initiatives identified"} 
            should be considered for mid-term expansion. 
            ${phase3.length ? phase3.join(", ") : "No long-term initiatives identified"} 
            are deferred due to complexity or risk considerations.
            </div>
        `;
    }

    // CHARTS

    if (scoreChart) scoreChart.destroy();
    if (priorityChart) priorityChart.destroy();

    const labels = useCases.map(u => u.name);
    const scores = useCases.map(u => u.score);

    const highCount = useCases.filter(u => u.priority === "High").length;
    const mediumCount = useCases.filter(u => u.priority === "Medium").length;
    const lowCount = useCases.filter(u => u.priority === "Low").length;

    const ctx1 = document.getElementById('scoreChart').getContext('2d');
    scoreChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score',
                data: scores,
                backgroundColor: '#0078D4'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });

    const ctx2 = document.getElementById('priorityChart').getContext('2d');
    priorityChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [highCount, mediumCount, lowCount],
                backgroundColor: ['#e74c3c', '#f39c12', '#27ae60']
            }]
        },
        options: {
            responsive: true
        }
    });
}

window.onload = function() {
    function updateWeights() {

    impactWeight = parseFloat(document.getElementById("impactWeight").value);
    dataWeight = parseFloat(document.getElementById("dataWeight").value);
    alignmentWeight = parseFloat(document.getElementById("alignmentWeight").value);
    riskWeight = parseFloat(document.getElementById("riskWeight").value);
    complexityWeight = parseFloat(document.getElementById("complexityWeight").value);

    document.getElementById("impactWeightValue").innerText = impactWeight;
    document.getElementById("dataWeightValue").innerText = dataWeight;
    document.getElementById("alignmentWeightValue").innerText = alignmentWeight;
    document.getElementById("riskWeightValue").innerText = riskWeight;
    document.getElementById("complexityWeightValue").innerText = complexityWeight;

    // Recalculate all scores
    useCases.forEach(u => {
        const values = u.name; // just placeholder, recalculation handled on new entries
    });

    displayResults();
}

document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", updateWeights);
});

    displayResults();
};
