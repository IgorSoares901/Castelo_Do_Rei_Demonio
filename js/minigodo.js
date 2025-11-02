
function Godo(context, imagem, animacao, camera) {
  this.context = context;
  this.animacao = animacao;
  this.camera = camera;

   // sons pré carregados já no construtor
  this.somDano = new Audio("mp3/hit.mp3");
  this.somDano.volume = 0.8;
  this.somDano.preload = "auto";

  this.somPulo = new Audio("mp3/bounce.mp3");
  this.somPulo.volume = 0.8;
  this.somPulo.preload = "auto";

  // posição inicial
  this.x = 0;
  this.y = 0;

  // spritesheet: 3 linhas (pulo, idle, morte) e 13 colunas
  this.sheet = new Spritesheet(context, imagem, 3, 13, [13, 8, 3], 0.8);
  this.sheet.intervalo = 120;

  // estado
  this.estado = "idle";
  this.direcao = "esquerda";

  // física
  this.velocidadeY = 0;
  this.noChao = false;
  this.yAnterior = this.y;
  this.alturaPulo = 100;
  this.velocidadeX = 3.5;
  this.cooldownAtaque = Date.now() + 2500;

  // colisão
  this.colisor = null;
  this.largura = 40;
  this.altura = 25;
  this.offsetX = 32;
  this.offsetY = 77;

  // estado de vida
  this.vivo = true;
  this.morrendo = false;
  this.frameMorte = 0;
}

Godo.prototype = {
  atualizar: function () {
    if (this.morrendo) {
      this.animarMorte();
      return;
    }

    if (!this.vivo) return;

    const agora = Date.now();
    const hero = window.heroina;
    if (!hero) return;

    // dano da heroína
    if (hero.danoAtivo && hero.viva) {
      const hit = hero.retanguloAtaque();
      if (hit) {
        const hb = this.hitbox();
        if (
          hit.x < hb.x + hb.largura &&
          hit.x + hit.largura > hb.x &&
          hit.y < hb.y + hb.altura &&
          hit.y + hit.altura > hb.y
        ) {
          this.morrer();
          return;
        }
      }
    }

    // se está visível
    const margem = 50;
    const visivel =
      this.x + 100 > this.camera.x - margem &&
      this.x < this.camera.x + this.camera.largura + margem;
    if (!visivel) return;

    // gravidade
    this.velocidadeY += 0.35;
    this.y += this.velocidadeY;

    // colisão com blocos
    if (this.colisor) {
      const hb = this.hitbox();
      let colidiuChao = false;

      for (const b of this.colisor.blocos) {
        if (b.tipo !== "chao" && b.tipo !== "parede") continue;

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
          if (dx < dy) {
            const push = overlapX > 0 ? dx : -dx;
            this.x += push;
            this.velocidadeX = Math.max(0.5, this.velocidadeX * 0.2);
            this.direcao =
              this.direcao === "esquerda" ? "direita" : "esquerda";
          } else {
            const push = overlapY > 0 ? dy : -dy;
            this.y += push;
            if (push < 0) {
              this.velocidadeY = 0;
              colidiuChao = true;
            } else {
              this.velocidadeY = 0.2;
            }
          }
        }
      }

      this.noChao = colidiuChao;
    }

    // pulo
    if (this.estado === "pulando") {
      if (this.velocidadeY < 0) {
        const progresso = (this.yAnterior - this.y) / this.alturaPulo;
        this.sheet.coluna = Math.min(6, Math.floor(progresso * 7));
      } else {
        const progresso =
          (this.y - (this.yAnterior - this.alturaPulo)) / this.alturaPulo;
        this.sheet.coluna = 7 + Math.min(5, Math.floor(progresso * 6));
      }

      if (this.direcao === "esquerda") this.x -= this.velocidadeX;
      else this.x += this.velocidadeX;

      if (this.noChao) {
        this.estado = "idle";
        this.cooldownAtaque = agora + 2500;
      }

      this.yAnterior = this.y;
      return;
    }

    // idle
    if (this.estado === "idle") {
      this.sheet.linha = 1;
      this.sheet.proximoQuadro();

      if (agora >= this.cooldownAtaque) {
        if (hero.x + 30 < this.x) this.direcao = "esquerda";
        else if (hero.x > this.x + 30) this.direcao = "direita";
        this.iniciarPulo();
      }
    }

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
    // toca o som de pulo
    if (this.somPulo) {
    this.somPulo.currentTime = 0; // reinicia o som
    this.somPulo.play().catch(() => {}); // executa e ignora erros de autoplay
    }
    this.noChao = false;
    this.estado = "pulando";
    this.sheet.linha = 0;
    this.sheet.coluna = 0;
    this.velocidadeY = -4;
    this.velocidadeX = 3; // muda esses valores para os pulos
    this.yAnterior = this.y;
  },

  morrer: function () {
    if (!this.vivo || this.morrendo) return;

    // toca o som pré carregado
  if (this.somDano) {
    this.somDano.currentTime = 0; // reinicia o som do início
    this.somDano.play().catch(() => {});
  }

    this.vivo = false;
    this.morrendo = true;
    this.estado = "morrendo";
    this.sheet.linha = 2;
    this.sheet.coluna = 0;
    this.frameMorte = 0;
    console.log("Mini-Godo morreu.");
  },

  animarMorte: function () {
    if (++this.frameMorte % 10 === 0) {
      this.sheet.coluna++;
    }
    if (this.sheet.coluna >= 3) {
      if (this.animacao && this.animacao.excluirSprite)
        this.animacao.excluirSprite(this);
      this.morrendo = false;
    }
  },

  hitbox: function () {
    return {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.largura,
      altura: this.altura,
    };
  },

  desenhar: function () {
    const ctx = this.context;
    this.sheet.desenhar(this.x, this.y, this.direcao === "esquerda");

    // debug
   /* const hb = this.hitbox();
    ctx.save();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);
    ctx.restore();*/
  },
};