window.onload = function() {
    let datos = JSON.parse(localStorage.getItem("intercambio"));

    // Mostrar datos generales
    document.getElementById("motivoR").innerText = datos.evento;
    document.getElementById("organizadorR").innerText = datos.organizador;
    document.getElementById("fechaR").innerText =datos.fecha;
    document.getElementById("presupuestoR").innerText = datos.presupuesto;

    let participantes = [...datos.participantes];
    if (datos.participa) participantes.push(datos.organizador);

    function esValido(de, a) {
        if (de === a) return false;
        for (let ex of datos.exclusiones) {
            if (ex.de === de && ex.a === a) return false;
        }
        return true;
    }

    // Variables para mostrar resultados secuencialmente
    let resultado = {};
    let relaciones = [];
    let indiceActual = 0;
    let estadoVisible = false; // false = silueta, true = revelado
    const contenedorSecuencial = document.getElementById("resultadoUno"); // contenedor
    const btnSiguiente = document.getElementById("btnSiguiente");

    function sorteo() {
        let receptores = [...participantes];
        resultado = {};

        for (let p of participantes) {
            let posibles = receptores.filter(r => esValido(p, r));
            if (posibles.length === 0) {
                location.reload();
                return;
            }
            let elegido = posibles[Math.floor(Math.random() * posibles.length)];
            resultado[p] = elegido;
            receptores = receptores.filter(r => r !== elegido);
        }

        relaciones = Object.entries(resultado);
        indiceActual = 0;
        contenedorSecuencial.innerHTML = "";
        estadoVisible = false;
    }

    function mostrarSiguiente() {
        // Si ya no hay más relaciones
        if (indiceActual >= relaciones.length && estadoVisible) {
            contenedorSecuencial.innerHTML = "<p>¡Todos los intercambios revelados!</p>";
            btnSiguiente.disabled = true;
            return;
        }

        // Caso 1: relación en pantalla oculta → revelar receptor
        if (estadoVisible === false && contenedorSecuencial.firstChild) {
            const receptor = relaciones[indiceActual - 1][1];
            contenedorSecuencial.firstChild.innerHTML = `
                ${relaciones[indiceActual - 1][0]} → <strong>${receptor}</strong>
            `;
            contenedorSecuencial.firstChild.style.opacity = 1;
            contenedorSecuencial.firstChild.style.transform = "translateY(0)";
            estadoVisible = true;
            return;
        }

        // Caso 2: quitar relación anterior
        if (contenedorSecuencial.firstChild) {
            contenedorSecuencial.firstChild.remove();
            estadoVisible = false;
        }

        // Caso 3: mostrar nueva relación con silueta
        if (indiceActual < relaciones.length) {
            const [participante, receptor] = relaciones[indiceActual];
            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `${participante} → <span class="silueta"></span>`;

            // Estilo inicial para animación
            card.style.opacity = 0;
            card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            card.style.transform = "translateY(-20px)";

            contenedorSecuencial.appendChild(card);

            // Animar aparición de la silueta
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = "translateY(0)";
            }, 50);

            estadoVisible = false; // aún oculta el receptor
            indiceActual++;
        }
    }

    function mostrarTodos() {
        const div = document.getElementById("resultados");
        div.innerHTML = "";
        for (let [p, r] of Object.entries(resultado)) {
            const card = document.createElement("div");
            card.className = "result-card";
            card.innerText = `${p} → ${r}`;
            div.appendChild(card);
        }
        contenedorSecuencial.innerHTML = "";
        btnSiguiente.disabled = true;
    }

    // Botones
    btnSiguiente.addEventListener("click", mostrarSiguiente);
    const btnTodos = document.getElementById("btnTodos");
    btnTodos?.addEventListener("click", mostrarTodos);

    // Botón reiniciar
    document.getElementById("btnReiniciar")?.addEventListener("click", function() {
        localStorage.removeItem("intercambio");
        window.location.href = "index.html";
    });

    sorteo();
};