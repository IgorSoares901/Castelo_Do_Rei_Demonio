function Osso(context, imagem, x, y, direcao) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.velocidadeX = direcao === "esquerda" ? -1 : 1; // ele sendo jogado para o lado
    this.velocidadeY = -6.7; // arremesso para cima
    this.gravidade = 0.3;

    this.sheet = new Spritesheet(context, imagem, 1, 3);
    this.sheet.intervalo = 120;

    // hitbox
    this.offsetX = 5;
    this.offsetY = 5;
    this.hitboxLargura = 20;
    this.hitboxAltura = 20;
}

Osso.prototype = {
    atualizar: function () {
    // Física do arremesso
    this.velocidadeY += this.gravidade;
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    this.sheet.proximoQuadro();

    // colisão do osso com a heroina
    if (window.heroina) {
        const hb = {
            x: this.x + this.offsetX,
            y: this.y + this.offsetY,
            largura: this.hitboxLargura,
            altura: this.hitboxAltura,
        };

        const h = {
            x: window.heroina.x + 27,
            y: window.heroina.y + 37,
            largura: 20,
            altura: 42,
        };

        if (
            hb.x < h.x + h.largura &&
            hb.x + hb.largura > h.x &&
            hb.y < h.y + h.altura &&
            hb.y + hb.altura > h.y
        ) {
            console.log("Heroína atingida pelo osso!");
            if (this.animacao && this.animacao.excluirSprite)
                this.animacao.excluirSprite(this);

            if (!window.heroina.invencivel)
                window.heroina.tomarDano();
            return;
        }
    }

    // quando o osso sai da tela é excluido
    if (this.y > 500 || this.x < 0 || this.x > 5000) {
        if (this.animacao && this.animacao.excluirSprite)
            this.animacao.excluirSprite(this);
    }
},
    desenhar: function () {
        const ctx = this.context;

        this.context.save();
        this.context.scale(1.5, 1.5); // aumenta o tamanho
        this.sheet.desenhar(this.x / 1.5, this.y / 1.5, false);
        this.context.restore();

        // debug
   /* const hb = {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.hitboxLargura,
      altura: this.hitboxAltura,
    };

    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);
    ctx.restore();
    },*/
},
};