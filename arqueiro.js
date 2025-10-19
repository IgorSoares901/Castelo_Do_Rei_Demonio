function Arqueiro(context, imagem, animacao) {
    this.context = context;

    this.animacao = animacao;

    this.x = 250;

    this.y = 200;

    this.sheet = new Spritesheet(context, imagem, 3, 15, [7, 15, 5]);

    this.sheet.intervalo = 120; // velocidade da animação

    this.estado = "idle";

}

Arqueiro.prototype = {
  atualizar: function() {
    // coloquei a animação em iddle por enquanto
    if (this.estado === "idle") {
      this.sheet.linha = 0;
      this.sheet.proximoQuadro();
    }
  },

  desenhar: function() {
    this.sheet.desenhar(this.x, this.y, true); //o true espelha a imagem
  }
};
