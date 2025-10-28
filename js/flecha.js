function Flecha(context, imagem, x, y, velocidade) {
  this.context = context;
  this.imagem = imagem;
  this.x = x;
  this.y = y;
  this.velocidade = velocidade;
  this.largura = imagem.width;
  this.altura = imagem.height;
}

Flecha.prototype = {
  atualizar: function() {
    // A flecha anda pra esquerda
    this.x -= this.velocidade;

    // Se sair da tela, remove da animação
    if (this.x + this.largura < 0) {
      this.animacao.excluirSprite(this);
    }
  },

  desenhar: function() {
    this.context.drawImage(this.imagem, this.x, this.y);
  }
};