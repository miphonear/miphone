const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRr62BlKCzICpC0ctnU2mRB8cq_SOCcsgydXQJXD5pQvasO1b1iT0Wp_L7sFxH8UGJCepaMjng1GUO0/pub?gid=1610793698&single=true&output=csv";

// Cotizacion
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQJ7PS8pvnCKdpLgJFonsZNN54Rs8oTpzGgCxhbfZzd3KmKb9k12OEwgAWuDAHiIPraWKxoS5TlCm4X/pub?gid=0&single=true&output=csv")
    .then(res => res.text())
    .then(csv => {
      const lineas = csv.trim().split("\n");
      const valorDolar = lineas[1] ? lineas[1].replace(",", ".") : "N/A"; // fila 2, columna 1
      document.getElementById("dolarValor").textContent = "$" + valorDolar;
    })
    .catch(err => {
      document.getElementById("dolarValor").textContent = "Error";
      console.error("Error al obtener dólar:", err);
    });

  // Fecha
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  document.getElementById("fechaActual").textContent = `${dia}/${mes}/${anio}`;

// Obtener y procesar datos CSV
fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
    const lines = csv.trim().split("\n").map(line => line.split(","));
    const categorias = [];
    let categoriaActual = null;
    let esperandoHeader = false;

    for (let i = 0; i < lines.length; i++) {
      const row = lines[i].map(cell => cell.trim());

      if (row[0] && row.slice(1).every(cell => cell === "")) {
        categoriaActual = { nombre: row[0], headers: [], productos: [] };
        categorias.push(categoriaActual);
        esperandoHeader = true;
      } else if (esperandoHeader && categoriaActual) {
        categoriaActual.headers = row;
        esperandoHeader = false;
      } else if (categoriaActual && row.some(cell => cell !== "")) {
        categoriaActual.productos.push(row);
      } else if (categoriaActual) {
        categoriaActual.productos.push(row);
      }
    }

    renderCategorias(categorias);
  });

// Renderizar categorías y productos
function renderCategorias(categorias) {
  const container = document.getElementById("categoriasContainer");
  container.innerHTML = "";

  categorias.forEach((cat, index) => {
    const catId = `cat-${index}`;
    const ocultarColumnaIndex = cat.headers.indexOf("Ocultar");

    const card = document.createElement("div");
    card.className = "accordion mb-4";
    card.innerHTML = `
      <div class="accordion-item border">
        <h2 class="accordion-header" id="heading-${catId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${catId}" aria-expanded="false" aria-controls="collapse-${catId}">
            ${cat.nombre}
          </button>
        </h2>
        <div id="collapse-${catId}" class="accordion-collapse collapse" aria-labelledby="heading-${catId}">
          <div class="accordion-body">
            <div class="table-responsive">
              <table class="table table-bordered table-sm text-center" id="tabla-${catId}">
                <thead class="table-light">
                  <tr>
                    ${cat.headers
                      .filter(h => h !== "Ocultar")
                      .map(h => `<th>${h}</th>`)
                      .join("")}
                  </tr>
                </thead>
                <tbody>
                  ${cat.productos
                    .filter(row => {
                      if (ocultarColumnaIndex === -1) return true;
                      const valor = row[ocultarColumnaIndex];
                      return !(valor && valor.toLowerCase() === "x");
                    })
                    .map(row => `
                      <tr>
                        ${row
                          .map((cell, index) => {
                            if (index === ocultarColumnaIndex) return null;

                            if (cat.headers[index] === "L" && cell) {
                              if (cell === "NEW") {
                                return `<td><span class="badge bg-warning text-dark">✈️¡NUEVO!</span></td>`;
                              } else if (cell === "SALE") {
                                return `<td><span class="badge bg-danger text-white">🔥¡OFERTA!</span></td>`;
                              }
                            }

                            return `<td>${cell || "&nbsp;"}</td>`;
                          })
                          .filter(cell => cell !== null)
                          .join("")}
                      </tr>
                    `)
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Filtro general con debounce (ignorando columna de precios)
let timeoutId;
function filtrarGeneral() {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    const valor = document.getElementById("searchGeneral").value.toLowerCase();
    const categorias = document.querySelectorAll(".accordion-item");
    let encontradoGeneral = false;

    categorias.forEach(categoria => {
      const filas = categoria.querySelectorAll("tbody tr");
      const tituloCategoria = categoria.querySelector(".accordion-button").innerText.toLowerCase();
      let encontradoCategoria = false;

      filas.forEach(fila => {
        const celdasFiltradas = Array.from(fila.cells)
          .filter((_, index) => index !== 2) // Ignora columna de precios
          .map(cell => cell.innerText)
          .join(" ");

        const textoFila = (celdasFiltradas + " " + tituloCategoria).toLowerCase();
        const palabras = valor.split(" ");
        const mostrarFila = palabras.every(palabra => textoFila.includes(palabra));

        fila.style.display = mostrarFila ? "" : "none";
        if (mostrarFila) encontradoCategoria = true;
      });

      const acordeon = categoria.querySelector(".accordion-collapse");
      if (encontradoCategoria) {
        acordeon.classList.add("show");
        encontradoGeneral = true;
      } else {
        acordeon.classList.remove("show");
      }
    });

    if (valor === "" || !encontradoGeneral) {
      const acordeones = document.querySelectorAll(".accordion-collapse");
      acordeones.forEach(collapse => collapse.classList.remove("show"));
    }
  }, 300);
}

// Cerrar acordeones dentro del modal FAQ al cerrarlo
document.getElementById("faqModal").addEventListener("hidden.bs.modal", () => {
  const accordions = document.querySelectorAll("#faqModal .accordion-collapse.show");
  accordions.forEach(ac => {
    new bootstrap.Collapse(ac, { toggle: false }).hide();
  });
});
