function Arqueiro(context, imagem, animacao, camera) {
  this.context = context;
  this.animacao = animacao;

  this.camera = camera; // tive que adicionar a camera ao construtor

  this.colisor = null;

  this.velocidadeY = 0; // gravidade
  this.noChao = false;

  // mexe na hitbox desse arrombado
  this.largura = 22;   // tamanho horizontal da colisão
  this.altura = 55;    // tamanho vertical da colisão
  this.offsetX = 40;   // deslocamento lateral
  this.offsetY = 40;   // deslocamento vertical

  this.sheet = new Spritesheet(context, imagem, 3, 15, [7, 15, 5], 0.75)
  this.sheet.intervalo = 120; // velocidade da animação
  
  this.estado = "idle";
  this.frameAtaque = 0;
  this.tempoProximoAtaque = Date.now() + 2000; //  para iniciar a animação de atirar

  this.vivo = true; 
  this.morrendo = false; //ambos estados de vida dele

  this.imagemFlecha = new Image();
  this.imagemFlecha.src = "imagem/Arrow.png"
}

Arqueiro.prototype = {
  atualizar: function () {
    // se ele estiver morto não atualiza nada
    if(!this.vivo) return;

    // isso aqui esta verificando se o inimigo ta dentro da camera
  const margem = 50; // margem pra começar um pouco antes de aparecer não funciona 100% mas é o que tem
  const visivel =
    this.x + this.largura > this.camera.x - margem &&
    this.x < this.camera.x + this.camera.largura + margem &&
    this.y + this.altura > this.camera.y - margem &&
    this.y < this.camera.y + this.camera.altura + margem;

  if (!visivel) return; // se estiver fora da tela, não atualiza

    // morte dele
    if(this.morrendo) {
      if(++this.frameAtaque % 8 === 0){
        this.sheet.coluna++;
        if (this.sheet.coluna >= 5) {
          // fim da animação de morte
          this.vivo = false;
          // remove da animação
          if (this.animacao.excluirSprite)
            this.animacao.excluirSprite(this);
        }
      }
      // morrendo não faz mais nada
      return;
    }
    const agora = Date.now();

    this.velocidadeY += 0.5; // gravidade
    this.y += this.velocidadeY;

    //checa colisão com blocos
    const hb = {
        x: this.x + this.offsetX,
        y: this.y + this.offsetY,
        largura: this.largura,
        altura: this.altura};
    for (const bloco of this.colisor.blocos) {
      // colisão vertical 
      if (
    hb.x < bloco.x + bloco.largura &&
    hb.x + hb.largura > bloco.x &&
    hb.y + hb.altura > bloco.y &&
    hb.y + hb.altura < bloco.y + bloco.altura &&
    this.velocidadeY >= 0
  ) {
    this.y = bloco.y - hb.altura - this.offsetY; // encosta o sprite no chão
    this.velocidadeY = 0;
    this.noChao = true;
  }
}

    // se estiver em idle
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

    // se estiver atacando
    else if (this.estado === "atacando") {
        if (++this.frameAtaque % 6 === 0) {
            this.sheet.coluna++;

    // dispara a flecha no quadro 12
    if (this.sheet.coluna ===12 && !this.flechaDisparada) {
        const flecha = new Flecha(
            this.context,
            this.imagemFlecha,
            this.x + 10,
            this.y + 35, // x e y são as posições de onde a flecha vai sai
            4.5 // velocidade da flecha
        );

        flecha.animacao = this.animacao;
        this.animacao.novoSprite(flecha);
        this.flechaDisparada = true;
    }
        }

        // ao terminar a animação de ataque
        if (this.sheet.coluna>= 15) {
            this.sheet.coluna = 0;
            this.estado = "idle";
            this.flechaDisparada = false;
            this.tempoProximoAtaque = Date.now() + 1500; // novo ataque em 1.5 segundos
        }
    }
    // se cair do mapa (limite inferior)
if (this.y > 500) {
  this.y = 500 - this.altura;
  this.velocidadeY = 0;
  this.noChao = true;
}

// colisao com o ataque da heroina
if (window.heroina) {
  const ataque = window.heroina.retanguloAtaque();
  if (ataque) {
    if (
      ataque.x < hb.x + hb.largura &&
      ataque.x + ataque.largura > hb.x &&
      ataque.y < hb.y + hb.altura &&
      ataque.y + ataque.altura > hb.y
    ){
      this.morrer();
    }
  }
}
  },
morrer: function () {
  this.estado = "morrendo";
  this.morrendo = true;
  this.sheet.linha = 2;
  this.sheet.coluna = 0;
  this.frameAtaque = 0;
},

 desenhar: function () {
  if (!this.vivo && !this.morrendo) return;
  this.sheet.desenhar(this.x, this.y, true);

  // debug do arqueiro
  const ctx = this.context;

  // hitbox do arqueiro 
 const hb = {
  x: this.x + this.offsetX,
  y: this.y + this.offsetY,
  largura: this.largura,
  altura: this.altura,
};

  ctx.strokeStyle = "lime";
ctx.lineWidth = 2;
ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);

ctx.fillStyle = "lime";
ctx.beginPath();
ctx.arc(hb.x + hb.largura / 2, hb.y + hb.altura / 2, 3, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.arc(hb.x + hb.largura / 2, hb.y + hb.altura, 3, 0, Math.PI * 2);
ctx.fill();

ctx.font = "10px monospace";
ctx.fillStyle = "white";
ctx.fillText(
  `Arq → x:${Math.round(hb.x)} y:${Math.round(hb.y)} w:${hb.largura} h:${hb.altura}`,
  hb.x - 10,
  hb.y - 8
);
 }
}