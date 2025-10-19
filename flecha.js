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
        this.x -= this.velocidade; // com o - a flecha se move para a esquerda
        
        if (this.x + this.largura < 0) {
            this.animacao.excluirSprite(this); // exclui a flecha ao sair da tela
        }
    },

    desenhar: function() {
        this.context.drawImage(this.imagem, this.x, this.y);
    }
};