let participantes=[];

const input=document.getElementById("nombreParticipante");
const lista=document.getElementById("listaParticipantes");
const exclusionesDiv=document.getElementById("listaExclusiones");

function agregarParticipante(){

let nombre=input.value.trim();

if(nombre==="") return;

participantes.push(nombre);

input.value="";

mostrarParticipantes();
generarExclusiones();

}

function eliminarParticipante(index){

participantes.splice(index,1);

mostrarParticipantes();
generarExclusiones();

}

function mostrarParticipantes(){

lista.innerHTML="";

participantes.forEach((p,index)=>{

let div=document.createElement("div");

div.className="participante-item d-flex justify-content-between align-items-center";
div.draggable=true;

div.innerHTML=`
<span>${p}</span>
<button class="btn btn-danger btn-sm" onclick="eliminarParticipante(${index})">
Eliminar
</button>
`;

div.addEventListener("dragstart",()=>{

div.classList.add("dragging");

});

div.addEventListener("dragend",()=>{

div.classList.remove("dragging");

});

lista.appendChild(div);

});

}

lista.addEventListener("dragover",(e)=>{

e.preventDefault();

const dragging=document.querySelector(".dragging");

if(!dragging) return;

const elementos=[...lista.querySelectorAll(".participante-item:not(.dragging)")];

let siguiente=elementos.find(el=>{

return e.clientY <= el.offsetTop + el.offsetHeight/2;

});

lista.insertBefore(dragging,siguiente);

actualizarOrden();

});

function actualizarOrden(){

let nuevos=[...lista.children];

participantes=nuevos.map(el=>el.querySelector("span").innerText);

generarExclusiones();

}

function obtenerListaCompleta(){

let organizador=document.getElementById("organizador").value;
let participa=document.getElementById("participa").checked;

let lista=[...participantes];

if(participa && organizador!==""){

lista.push(organizador);

}

return lista;

}

function generarExclusiones(){

exclusionesDiv.innerHTML="";

let listaCompleta=obtenerListaCompleta();

listaCompleta.forEach(p=>{

let div=document.createElement("div");

div.className="mb-3";

let html=`<strong>${p}</strong><br>`;

listaCompleta.forEach(o=>{

if(p!==o){

html+=`
<label class="me-3">
<input type="checkbox" data-p="${p}" data-o="${o}">
${o}
</label>
`;

}

});

div.innerHTML=html;

exclusionesDiv.appendChild(div);

});

}

function guardarDatos(){

let organizador=document.getElementById("organizador").value;
let participa=document.getElementById("participa").checked;
let evento=document.getElementById("evento").value;
let fecha=document.getElementById("fecha").value;
let presupuesto=document.getElementById("presupuesto").value;

let exclusiones=[];

document.querySelectorAll("#listaExclusiones input:checked")
.forEach(c=>{

exclusiones.push({
de:c.dataset.p,
a:c.dataset.o
});

});

let datos={

organizador,
participa,
participantes,
evento,
fecha,
presupuesto,
exclusiones

};

localStorage.setItem("intercambio",JSON.stringify(datos));

window.location.href="resultado.html";

}