function Arqueiro(context, imagem, animacao) {
  this.context = context;
  this.animacao = animacao;

  this.x = 250;
  this.y = 200;

  this.sheet = new Spritesheet(context, imagem, 3, 15, [7, 15, 5]);
  this.sheet.intervalo = 120; // velocidade da animação

  this.estado = "idle";
  this.frameAtaque = 0;
  this.tempoProximoAtaque = Date.now() + 1500; // 1.5s para o primeiro ataque

  this.imagemFlecha = new Image();
  this.imagemFlecha.src = "imagem/Arrow.png"; 
}

Arqueiro.prototype = {
  atualizar: function () {
    const agora = Date.now();

    // Se estiver em idle
    if (this.estado === "idle") {
      this.sheet.linha = 0;
      this.sheet.proximoQuadro();

      if (agora >= this.tempoProximoAtaque) {
        this.estado = "atacando";
        this.sheet.linha = 1;
        this.sheet.coluna = 0;
        this.frameAtaque = 0;
      }
    }

    // Se estiver atacando
    else if (this.estado === "atacando") {
      if (++this.frameAtaque % 6 === 0) {
        this.sheet.coluna++;

        // Dispara a flecha no quadro 12
        if (this.sheet.coluna === 12 && !this.flechaDisparada) {
          const flecha = new Flecha(
            this.context,
            this.imagemFlecha,
            this.x + 10, // posição inicial
            this.y + 55, // posição inicial
            5 // velocidade
          );

          flecha.animacao = this.animacao;
          this.animacao.novoSprite(flecha);
          this.flechaDisparada = true;
        }
      }

      // Quando termina a animação de ataque
      if (this.sheet.coluna >= 15) {
        this.sheet.coluna = 0;
        this.estado = "idle";
        this.flechaDisparada = false;
        this.tempoProximoAtaque = Date.now() + 1500; // novo ataque em 1.5s
      }
    }
  },

  desenhar: function () {
    this.sheet.desenhar(this.x, this.y, true);
  },
};