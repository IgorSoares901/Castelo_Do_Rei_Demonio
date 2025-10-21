function Flecha(context, imagem, x, y, velocidade) {
    this.context = context;

    this.imagem = imagem;

    this.x = x;

    this.y = 230;

    this.velocidade = velocidade;

    this.largura = imagem.width;

    this.altura = imagem.height;
}

Flecha.prototype = {
    atualizar: function() {
        this.x -= this.velocidade; // com o - a flecha se move para a esquerda
        
        if (this.x + this.largura < 0) {
            this.animacao.excluirSprite(this); // exclui a flecha ao sair da tela
        }
    },

    desenhar: function() {
        this.context.drawImage(this.imagem, this.x, this.y);
        // DEBUG DE COLISÃO
        var ctx = this.context;
        ctx.save();
        ctx.strokeStyle = 'purple';
        var rets = this.retangulosColisao();
        for (var i in rets) {
            var r = rets[i];
            ctx.strokeRect(r.x, r.y, r.largura, r.altura);
        }
        ctx.restore();
    },

    // colisão
   retangulosColisao: function() {
  var rets = [];

  // retangulo de colisão do arqueiro
  rets.push({
    x: this.x - 2,
    y: this.y + 20,
    largura: 50,
    altura: 10
  });
  return rets;
},

    colidiuCom: function(outro) {
    console.log("Flecha colidiu", outro);
},
};