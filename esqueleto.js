function Esqueleto(context, imagem, animacao, camera) {
    this.context = context;
    this.animacao = animacao;
    this.camera = camera;

    this.x = 100;
    this.y = 330;

    this.sheet = new Spritesheet(context, imagem, 2, 2,[1, 2], 1.7);
    this.sheet.intervalo = 120;

    this.estado = "idle";
    this.ladoPadrao = "esquerda"; // como a imagem ja vem com ele olhando pra esquerda tive que adicionar
    this.direcao = "esquerda";

    this.imagemOsso = new Image();
    this.imagemOsso.src = "imagem/osso.png";

    this.tempoProximoAtaque = Date.now() + 1150;
}

Esqueleto.prototype = {
    atualizar: function() {
        const agora = Date.now();
        const hero = window.heroina;

    // ele acompanha a heroina olhando para direita e esquerda
    if (hero) {
        if (hero.x > this.x) {
            this.direcao = "direita";
        } else {
            this.direcao = "esquerda";
        }
    }
        // é o ataque desse básico 
        if (this.estado === "idle") {
            this.sheet.linha = 0;
            this.sheet.coluna = 0;
            this.sheet.proximoQuadro();

            if (agora >= this.tempoProximoAtaque) {
                this.atirar();
                this.tempoProximoAtaque = agora + 1150;
            }
        }
    },

   atirar: function () {
    // precisa desses offsets pra ajustar de onde sai o osso
    let offsetX, offsetY;

    if (this.direcao === "direita") {
        offsetX = 25; // muda esses offsets pra fazer o osso sair de partes diferentes do corpo dele
        offsetY = 5; // muda esses offsets pra fazer o osso sair de partes diferentes do corpo dele
    } else {
        offsetX = 5; // muda esses offsets pra fazer o osso sair de partes diferentes do corpo dele
        offsetY = 10; // muda esses offsets pra fazer o osso sair de partes diferentes do corpo dele
    }

    const osso = new Osso(
        this.context,
        this.imagemOsso,
        this.x + offsetX,
        this.y + offsetY, // teve que colocar os offsets aqui
        this.direcao
    );
        osso.animacao = this.animacao;
        this.animacao.novoSprite(osso);
    },

    desenhar: function () {
        this.sheet.desenhar(this.x, this.y, this.direcao !== this.ladoPadrao);
    },
    
};