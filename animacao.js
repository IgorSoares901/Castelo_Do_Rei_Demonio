function Animacao(context) {
    this.context = context;
    this.sprites = [];
    this.ligado = false;
 }
 Animacao.prototype = {
    novoSprite: function(sprite) {
       this.sprites.push(sprite);
    },

    excluirSprite: function(sprite) {
      var indice = this.sprites.indexOf(sprite);
      if (indice !== -1) {
         this.sprites.splice(indice, 1);
      }
    }, // tive que adicionar toda essa function para o arqueiro não desaparecer junto com a flecha
    ligar: function() {
       this.ligado = true;
       this.proximoFrame();
    },
    desligar: function() {
       this.ligado = false;
    },
    proximoFrame: function() {
       // Posso continuar?
       if ( ! this.ligado ) return;
 
       // A cada ciclo, limpamos a tela ou desenhamos um fundo
       this.limparTela();
 
       // Atualizamos o estado dos sprites
       for (var i in this.sprites)
          this.sprites[i].atualizar();
 
       // Desenhamos os sprites
       for (var i in this.sprites)
          this.sprites[i].desenhar();
 
       // Chamamos o próximo ciclo
       var animacao = this;
       requestAnimationFrame(function() {
          animacao.proximoFrame();
       });
    },
    limparTela: function() {
       var ctx = this.context;
       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
 }