// URL del CSV con las categorías y productos
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRr62BlKCzICpC0ctnU2mRB8cq_SOCcsgydXQJXD5pQvasO1b1iT0Wp_L7sFxH8UGJCepaMjng1GUO0/pub?gid=1610793698&single=true&output=csv";

// URL para obtener la cotización del dólar
const cotizacionUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJ7PS8pvnCKdpLgJFonsZNN54Rs8oTpzGgCxhbfZzd3KmKb9k12OEwgAWuDAHiIPraWKxoS5TlCm4X/pub?gid=0&single=true&output=csv";

// Obtener y mostrar la cotización del dólar
fetch(cotizacionUrl)
  .then(res => res.text())
  .then(csv => {
    const lineas = csv.trim().split("\n");
    if (lineas.length > 0) {
      const valorDolar = lineas[0].split(",")[0].replace(",", ".");
      document.getElementById("dolarValor").textContent = valorDolar || "N/A";
    } else {
      document.getElementById("dolarValor").textContent = "Sin datos";
    }
  })
  .catch(err => {
    document.getElementById("dolarValor").textContent = "Error";
    console.error("Error al obtener dólar:", err);
  });

// Mostrar la fecha actual
const fechaFormateada = new Intl.DateTimeFormat("es-AR").format(new Date());
document.getElementById("fechaActual").textContent = fechaFormateada;

// Obtener y procesar los productos desde el CSV
fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
    const lines = csv.trim().split("\n").map(line => line.split(","));
    const categorias = [];
    let categoriaActual = null;
    let esperandoHeader = false;

    lines.forEach(row => {
      row = row.map(cell => cell.trim());

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
        categoriaActual.productos.push(row);  // Manejar filas vacías dentro de la categoría
      }
    });

    renderCategorias(categorias);
  });

// Definir los íconos para las categorías
const iconosCategorias = {
  "IPHONE": "bi bi-apple",
  "AIRPODS": "bi bi-earbuds",
  "APPLE WATCH": "bi bi-smartwatch",
  "AIRTAG": "bi bi-smartwatch",
  "IPAD": "bi-tablet-fill",
};

// Definir los Badges
const badges = {
  "NEW": `<span class="badge bg-warning text-dark">✈️¡NUEVO!</span>`,
  "SALE": `<span class="badge bg-danger text-white">🔥¡OFERTA!</span>`,
  "HOT": `<span class="badge bg-primary">🔥 HOT</span>`,
  "LIMITED": `<span class="badge bg-info text-dark">⏳ Edición limitada</span>`
};

// Renderizar categorías y productos
function renderCategorias(categorias) {
  const container = document.getElementById("categoriasContainer");
  container.innerHTML = "";  // Limpiar el contenedor antes de agregar los productos

  categorias.forEach((cat, index) => {
    const catId = `cat-${index}`;
    const ocultarColumnaIndex = cat.headers.indexOf("Ocultar");

    // Asignar el ícono usando el objeto iconosCategorias
    const icono = iconosCategorias[cat.nombre] || "bi bi-phone";  // Ícono por defecto

    // Crear la estructura HTML de cada categoría y su tabla
    const card = document.createElement("div");
    card.className = "accordion mb-1";
    card.innerHTML = `
      <div class="accordion-item border">
        <h2 class="accordion-header" id="heading-${catId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${catId}" aria-expanded="false" aria-controls="collapse-${catId}">
            <i class="${icono} me-2"></i> ${cat.nombre}
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
                    .filter(row => ocultarColumnaIndex === -1 || row[ocultarColumnaIndex].toLowerCase() !== "x")
                    .map(row => {
                      const esFilaVacia = row.every(cell => cell === "");
                      if (esFilaVacia) {
                        return `<tr><td colspan="${cat.headers.length - (ocultarColumnaIndex !== -1 ? 1 : 0)}">&nbsp;</td></tr>`;
                      }

                      return `
                        <tr>
                          ${row
                            .map((cell, index) => {
                              if (index === ocultarColumnaIndex) return null;

                              // Si la columna "L" contiene un badge, mostrarlo
                              if (cat.headers[index] === "L" && cell) {
                                const badge = badges[cell];
                                return `<td>${badge || cell}</td>`;  // Mostrar el badge o el texto tal cual
                              }

                              return `<td>${cell || "&nbsp;"}</td>`;
                            })
                            .filter(cell => cell !== null)
                            .join("")}
                        </tr>
                      `;
                    })
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

// Filtro general con debounce
let timeoutId;
function filtrarGeneral() {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    const valor = document.getElementById("searchGeneral").value.toLowerCase();
    const resultadoBusqueda = document.getElementById("resultadoBusqueda");
    const categorias = document.querySelectorAll(".accordion-item");
    let encontradoGeneral = false;
    let totalCoincidencias = 0;

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
        if (mostrarFila) {
          encontradoCategoria = true;
          totalCoincidencias++;
        }
      });

      const acordeon = categoria.querySelector(".accordion-collapse");
      if (encontradoCategoria) {
        acordeon.classList.add("show");
        encontradoGeneral = true;
      } else {
        acordeon.classList.remove("show");
      }
    });

    const acordeones = document.querySelectorAll(".accordion-collapse");
    if (valor === "") {
      resultadoBusqueda.textContent = "";
      resultadoBusqueda.classList.remove("no-resultado", "resultado-encontrado"); // Elimina ambas clases si se borra el valor
      acordeones.forEach(collapse => collapse.classList.remove("show"));
    } else {
      let mensajeResultado = "";
      if (totalCoincidencias === 0) {
        mensajeResultado = "Sin resultados. Consultar existencia por WhatsApp";
        resultadoBusqueda.classList.add("no-resultado"); // Agrega la clase no-resultado si no hay resultados
        resultadoBusqueda.classList.remove("resultado-encontrado"); // Elimina la clase resultado-encontrado si no hay resultados
      } else {
        mensajeResultado = `${totalCoincidencias} resultado${totalCoincidencias !== 1 ? "s" : ""} encontrado${totalCoincidencias !== 1 ? "s" : ""}`;
        resultadoBusqueda.classList.add("resultado-encontrado"); // Agrega la clase resultado-encontrado si hay resultados
        resultadoBusqueda.classList.remove("no-resultado"); // Elimina la clase no-resultado si hay resultados
      }

      resultadoBusqueda.textContent = mensajeResultado;
    }
  }, 300);
}
// Cerrar acordeones dentro del modal FAQ
document.getElementById("faqModal").addEventListener("hidden.bs.modal", () => {
  const accordions = document.querySelectorAll("#faqModal .accordion-collapse.show");
  accordions.forEach(ac => {
    new bootstrap.Collapse(ac, { toggle: false }).hide();
  });
});
