document.addEventListener("DOMContentLoaded", async () => {
    await carregarGraficos();
    await carregarResumo();
});

/* ============================
   BUSCA DADOS DO BACKEND
============================ */

async function buscar(path) {
    try {
        const response = await fetch(path);
        return await response.json();
    } catch (err) {
        console.error("Erro ao buscar:", err);
        return null;
    }
}

/* ============================
   CARREGA RESUMO SUPERIOR
============================ */

async function carregarResumo() {
    const dados = await buscar("/api/resumo");

    if (!dados) return;

    document.getElementById("totalTreinos").innerText = dados.totalTreinos;
    document.getElementById("totalSeries").innerText = dados.totalSeries;
    document.getElementById("totalExercicios").innerText = dados.totalExercicios;
}

/* ============================
   GRÁFICOS
============================ */

async function carregarGraficos() {
    const dados = await buscar("/api/graficos");

    if (!dados) return;

    gerarGraficoLinha("graficoVolume", "Volume Total (kg)", dados.volume.labels, dados.volume.values);
    gerarGraficoLinha("graficoSeries", "Séries por Dia", dados.series.labels, dados.series.values);
}

/* ============================
   FUNÇÃO GERAR GRÁFICO
============================ */

function gerarGraficoLinha(idCanvas, label, labels, data) {
    const ctx = document.getElementById(idCanvas).getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: label,
                data,
                borderWidth: 2,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}