var SETA_ESQUERDA = 37;
var SETA_DIREITA = 39;
var SETA_CIMA =38;
var ESPACO = 32;

function Teclado(elemento) {
   this.elemento = elemento;

   // Array de teclas pressionadas
   this.pressionadas = [];

   // Array de teclas disparadas
   // this.disparadas = []; desnecessária para nosso jogo

   // Funções de disparo registradas
  // this.funcoesDisparo = []; tbm inutil

   var teclado = this;

   elemento.addEventListener('keydown', function(evento) {
     teclado.pressionadas[evento.keyCode] = true;

      // Disparar somente se for o primeiro keydown da tecla
    //  if (teclado.funcoesDisparo[tecla] && !teclado.disparadas[tecla]) {

        //  teclado.disparadas[tecla] = true;
        //  teclado.funcoesDisparo[tecla] () ;
     // } tudo isso desnecessário
   });

   elemento.addEventListener('keyup', function(evento) {
      teclado.pressionadas[evento.keyCode] = false;
      // teclado.disparadas[evento.keyCode] = false; Rest in piss
   });
}
Teclado.prototype = {
   pressionada: function(tecla) {
      return this.pressionadas[tecla];
   }
  // disparou: function(tecla, callback) {
    //  this.funcoesDisparo[tecla] = callback;
  // } vai atirar não
}