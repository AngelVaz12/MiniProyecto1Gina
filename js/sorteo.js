let datos=JSON.parse(localStorage.getItem("intercambio"));

let participantes=[...datos.participantes];

if(datos.participa){

participantes.push(datos.organizador);

}

function esValido(de,a){

if(de===a) return false;

for(let ex of datos.exclusiones){

if(ex.de===de && ex.a===a) return false;

}

return true;

}

function sorteo(){

let receptores=[...participantes];

let resultado={};

for(let p of participantes){

let posibles=receptores.filter(r=>esValido(p,r));

if(posibles.length===0){

location.reload();
return;

}

let elegido=posibles[Math.floor(Math.random()*posibles.length)];

resultado[p]=elegido;

receptores=receptores.filter(r=>r!==elegido);

}

mostrarResultado(resultado);

}

function mostrarResultado(res){

const div=document.getElementById("resultados");

for(let p in res){

let card=document.createElement("div");

card.className="result-card";

card.innerText=p+" → "+res[p];

div.appendChild(card);

}

}

function reiniciar(){

localStorage.removeItem("intercambio");

window.location.href="index.html";

}

sorteo();