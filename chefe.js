function Chefe(context, imagem, animacao, camera) {
  this.context = context;
  this.animacao = animacao;
  this.camera = camera;

  // posição dele no mapa
  this.x = 4800;
  this.y = 50;

  
  this.sheet = new Spritesheet(context, imagem, 3, 13, [13, 8, 3], 1.8);
  this.sheet.intervalo = 120;

  // aqui é ele parado
  this.estado = "idle";
  this.direcao = "esquerda";

  // fisica inicial
  this.velocidadeY = 0;
  this.noChao = false;
  this.yAnterior = this.y;

  // pulo dele
  this.alturaPulo = 160;
  this.velocidadeX = 5.0;
  this.cooldownAtaque = Date.now() + 2000;

  // colisão
  this.colisor = null;
  this.largura = 90;
  this.altura = 50;
  this.offsetX = 73;  
  this.offsetY = 180; // além disso tive que usar a mesma colisão que a heroina para ir
}

Chefe.prototype = {
  atualizar: function () {
    const agora = Date.now();
    const hero = window.heroina;
    if (!hero) return;

    // só atualiza se estiver visível na câmera
    const margem = 50;
    const visivel =
      this.x + 100 > this.camera.x - margem &&
      this.x < this.camera.x + this.camera.largura + margem;
    if (!visivel) return;

    // gravidade que tbm serve de teste para colisão
    this.velocidadeY += 0.35;
    this.y += this.velocidadeY;

    // colisões 
    if (this.colisor) {
      const hb = {
        x: this.x + this.offsetX,
        y: this.y + this.offsetY,
        largura: this.largura,
        altura: this.altura,
      };

      let colidiuChao = false;

     for (const b of this.colisor.blocos) {
  if (b.tipo !== "chao" && b.tipo !== "parede") continue;

  // hitbox do Godofredo usando todas as coordenadas
  const hb = {
    x: this.x + this.offsetX,
    y: this.y + this.offsetY,
    largura: this.largura,
    altura: this.altura
  };

  // centros
  const centroHBX = hb.x + hb.largura / 2;
  const centroHBY = hb.y + hb.altura / 2;
  const centroBX = b.x + b.largura / 2;
  const centroBY = b.y + b.altura / 2;

  const overlapX = centroHBX - centroBX;
  const overlapY = centroHBY - centroBY;

  const halfWidths = (hb.largura + b.largura) / 2;
  const halfHeights = (hb.altura + b.altura) / 2;

  const dx = halfWidths - Math.abs(overlapX);
  const dy = halfHeights - Math.abs(overlapY);

  if (dx > 0 && dy > 0) {
    // a colisão da heroina resolve no eixo de menor penetração o que é o mais correto
    if (dx < dy) {
      // resolver na horizontal
    const push = (overlapX > 0) ? dx : -dx;
    // ajusta this.x considerando offsetX
      this.x += push;
    // impedir que continue se movendo pra parede
    if (Math.abs(push) > 0.1) {
    // como ele tava grudando na parede ao bater nela agora ele fica mais lento e é empurrado
    this.velocidadeX = Math.max(0.5, this.velocidadeX * 0.2);
    //inverter direção para próxima tentativa
    this.direcao = (this.direcao === "esquerda") ? "direita" : "esquerda";
      }
    } else {
      // resolver chap e teto
      const push = (overlapY > 0) ? dy : -dy;
      this.y += push;

      if (push < 0) {
        // no chão não empurra ao pousar
        this.velocidadeY = 0;
        colidiuChao = true;
      } else {
        // ele não obedece nosso teto mas é melhor deixar
        this.velocidadeY = 0.2;
      }
    }
  }
}


      this.noChao = colidiuChao;
    }

    // as animações dele
    if (this.estado === "pulando") {
      // pulando
      if (this.velocidadeY < 0) {
        const progresso = (this.yAnterior - this.y) / this.alturaPulo;
        this.sheet.coluna = Math.min(6, Math.floor(progresso * 7));
      } else {
        const progresso = (this.y - (this.yAnterior - this.alturaPulo)) / this.alturaPulo;
        this.sheet.coluna = 7 + Math.min(5, Math.floor(progresso * 6));
      }

      // esquerda e direita
      if (this.direcao === "esquerda") this.x -= this.velocidadeX;
      else this.x += this.velocidadeX;

      // idle no chão por 2 segundos
      if (this.noChao) {
        this.estado = "idle";
        this.cooldownAtaque = agora + 2000;
      }

      this.yAnterior = this.y;
      return;
    }

    if (this.estado === "idle") {
      this.sheet.linha = 1;
      this.sheet.proximoQuadro();

      if (agora >= this.cooldownAtaque) {
        // decide se vai pular na heroina
        this.direcao = hero.x < this.x ? "esquerda" : "direita";
        this.iniciarPulo();
      }
    }

    // impede de cair pra sempre, tipo quando matam o sekiro se ele ficar eternamente caindo
    if (this.y > 1000) {
      this.y = this.yAnterior;
      this.velocidadeY = 0;
      this.noChao = true;
      this.estado = "idle";
    }

    this.yAnterior = this.y;
  },

  iniciarPulo: function () {
  if (!this.noChao) return;

  this.noChao = false;
  this.estado = "pulando";
  this.sheet.linha = 0;
  this.sheet.coluna = 0;

  // teve que colocar uma nova força vertical por causa da colisão
  // numeros negativos ele vai pra cima, positivos pra baixo
  this.velocidadeY = -6.5; 

  // restaura velocidade horizontal completa a cada novo pulo
  this.velocidadeX = 5.5;

  this.yAnterior = this.y;
},

  desenhar: function () {
    const ctx = this.context;
    this.sheet.desenhar(this.x, this.y, this.direcao === "esquerda");

    // debug
    const hb = {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.largura,
      altura: this.altura,
    };

    ctx.save();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);

    ctx.font = "10px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(
      `x:${Math.round(hb.x)} y:${Math.round(hb.y)} vY:${this.velocidadeY.toFixed(2)}`,
      hb.x,
      hb.y - 8
    );
    ctx.restore();
  },
};
