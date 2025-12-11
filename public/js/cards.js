async function carregar() {
    const filtro = document.getElementById("filtro").value;

    const res = await fetch(`/cards/list?filtro=${filtro}`);
    const lista = await res.json();

    const box = document.getElementById("cards-container");
    box.innerHTML = "";

    lista.forEach(c => {
        box.innerHTML += `
        <div class="card">
            <img src="/uploads/${c.foto}">
            <h3>${c.nome}</h3>
            <p>CPF: ${c.cpf}</p>
            <p>RG: ${c.rg}</p>
            <p>Status: ${c.status}</p>
        </div>`;
    });
}

document.getElementById("filtro").oninput = carregar;

window.onload = carregar;
