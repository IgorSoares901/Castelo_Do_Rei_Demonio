function Osso(context, imagem, x, y, direcao) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.velocidadeX = direcao === "esquerda" ? -2 : 2; // impulso para o lado
    this.velocidadeY = -6; // arremesso para cima
    this.gravidade = 0.3;

    this.sheet = new Spritesheet(context, imagem, 1, 3);
    this.sheet.intervalo = 120;
}

Osso.prototype = {
    atualizar: function () {
        this.velocidadeY += this.gravidade;
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;

        this.sheet.proximoQuadro();

        // se sair da tela é removido
        if (this.y > 500) {
            if (this.animacao && this.animacao.excluirSprite)
                this.animacao.excluirSprite(this);
        }
    },

    desenhar: function () {
        this.context.save();
        this.context.scale(1.5, 1.5); // aumenta o tamanho
        this.sheet.desenhar(this.x / 1.5, this.y / 1.5, false);
        this.context.restore();
    },
};