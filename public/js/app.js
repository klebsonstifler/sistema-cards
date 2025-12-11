// ========================================
// UTILITÁRIOS
// ========================================
function $(sel) {
    return document.querySelector(sel);
}

function $all(sel) {
    return document.querySelectorAll(sel);
}

function getFormData(form) {
    const data = new FormData(form);
    return data;
}

function renderLista(registros) {
    const lista = $("#lista");
    lista.innerHTML = "";

    if (!registros || registros.length === 0) {
        lista.innerHTML = "<p>Nenhum registro encontrado.</p>";
        return;
    }

    registros.forEach((r) => {
        const div = document.createElement("div");
        div.className = "item-card";

        div.innerHTML = `
            <strong>${r.nome}</strong><br>
            CPF: ${r.cpf || "-"}<br>
            RG: ${r.rg || "-"}<br>
            ART: ${r.art || "-"}<br>
            QTH: ${r.qth || "-"}<br>
            Status: ${r.status}<br>
            Obs: ${r.obs || "-"}<br>
            ${r.foto ? `<img src="${r.foto}" class="foto">` : ""}
        `;

        lista.appendChild(div);
    });
}

function updateDashboard(stats) {
    $("#total").textContent = stats.total;
    $("#ativos").textContent = stats.ativos;
    $("#inativos").textContent = stats.inativos;

    renderChart(stats);
}

// ========================================
// DASHBOARD – CHART
// ========================================
let chartStatus;

function renderChart(stats) {
    const ctx = document.getElementById("chartStatus");

    if (chartStatus) chartStatus.destroy();

    chartStatus = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Ativos", "Inativos"],
            datasets: [{
                data: [stats.ativos, stats.inativos]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

// ========================================
// BUSCA E FILTROS
// ========================================
async function filtrar() {
    const filtros = {
        nome: $("#filtroNome").value.trim(),
        cpf: $("#filtroCPF").value.trim(),
        rg: $("#filtroRG").value.trim(),
        qth: $("#filtroQTH").value.trim(),
        status: $("#filtroStatus").value
    };

    const res = await fetch("/registros?" + new URLSearchParams(filtros));
    const dados = await res.json();

    renderLista(dados.lista);
    updateDashboard(dados.stats);
}

$("#btnFiltrar").addEventListener("click", filtrar);

// ========================================
// CRIAÇÃO DE NOVO REGISTRO (ADMIN)
// ========================================
if (window.CURRENT_USER.role === "admin") {
    $("#formNovo")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const data = getFormData(form);

        const res = await fetch("/registro", {
            method: "POST",
            body: data
        });

        if (!res.ok) {
            alert("Erro ao salvar.");
            return;
        }

        alert("Registro criado com sucesso.");
        form.reset();
        filtrar();
    });
}

// ========================================
// EXPORTAÇÃO CSV (ADMIN)
// ========================================
if (window.CURRENT_USER.role === "admin") {
    $("#exportCSV")?.addEventListener("click", () => {
        window.location.href = "/export/csv";
    });
}

// ========================================
// CARREGAR LISTA AO INICIAR
// ========================================
filtrar();
