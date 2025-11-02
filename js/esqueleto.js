function Esqueleto(context, imagem, animacao, camera) {
    this.context = context;
    this.animacao = animacao;
    this.camera = camera;

     // sons pré carregados já no construtor
  this.somDano = new Audio("mp3/osso-quebrado.mp3");
  this.somDano.volume = 0.8;
  this.somDano.preload = "auto";

  this.somTiro = new Audio("mp3/tiro.mp3");
  this.somTiro.volume = 0.8;
  this.somTiro.preload = "auto";

    this.sheet = new Spritesheet(context, imagem, 2, 2,[1, 2], 1.7);
    this.sheet.intervalo = 120;

    this.estado = "idle";
    this.ladoPadrao = "esquerda"; // como a imagem ja vem com ele olhando pra esquerda tive que adicionar
    this.direcao = "esquerda";

    this.velocidadeY = 0;
    this.noChao = false;

    this.colisor = null;
    this.largura = 28;
    this.altura = 48;
    this.offsetX = 15;
    this.offsetY = 5;

    this.vivo = true;
    this.morrendo = false;
    this.hitboxAtiva = true;
    this.frameMorte = 0;

    this.imagemOsso = new Image();
    this.imagemOsso.src = "imagem/osso.png";

    this.tempoProximoAtaque = Date.now() + 1500;
}

Esqueleto.prototype = {
    atualizar: function() {
        if (!this.vivo) return;

        // isso aqui esta verificando se o inimigo ta dentro da camera
  const margem = 50; // margem pra começar um pouco antes de aparecer não funciona 100% mas é o que tem
  const visivel =
    this.x + this.largura > this.camera.x - margem &&
    this.x < this.camera.x + this.camera.largura + margem &&
    this.y + this.altura > this.camera.y - margem &&
    this.y < this.camera.y + this.camera.altura + margem;

  if (!visivel) return; // se estiver fora da tela, não atualiza

        const agora = Date.now();
        const hero = window.heroina;

        // animação de morte
    if (this.morrendo) {
      if (++this.frameMorte % 15 === 0) {
        this.sheet.coluna++;
        if (this.sheet.coluna >= 2) {
          this.vivo = false;
          this.morrendo = false;
          if (this.animacao && this.animacao.excluirSprite)
            this.animacao.excluirSprite(this);
          console.log("Inimigo morto!");
        }
      }
      return; // para de atualizar enquanto morre
    }


    // ele acompanha a heroina olhando para direita e esquerda
    if (hero) {
        if (hero.x > this.x) {
            this.direcao = "direita";
        } else {
            this.direcao = "esquerda";
        }

    // gravidade
    this.velocidadeY += 0.4;
    this.y += this.velocidadeY;

    // colisão com chão 
    if (this.colisor) {
      const hb = {
        x: this.x + this.offsetX,
        y: this.y + this.offsetY,
        largura: this.largura,
        altura: this.altura,
      };

      for (const bloco of this.colisor.blocos) {
        if (
          hb.x < bloco.x + bloco.largura &&
          hb.x + hb.largura > bloco.x &&
          hb.y + hb.altura > bloco.y &&
          hb.y + hb.altura < bloco.y + bloco.altura &&
          this.velocidadeY >= 0
        ) {
          this.y = bloco.y - hb.altura - this.offsetY;
          this.velocidadeY = 0;
          this.noChao = true;
        }
      }
    }

    // ataque da heroína
    if (this.hitboxAtiva && hero && hero.viva) {
      const ataque = hero.retanguloAtaque();
      if (ataque) {
        const hb = {
          x: this.x + this.offsetX,
          y: this.y + this.offsetY,
          largura: this.largura,
          altura: this.altura,
        };
        if (
          ataque.x < hb.x + hb.largura &&
          ataque.x + ataque.largura > hb.x &&
          ataque.y < hb.y + hb.altura &&
          ataque.y + ataque.altura > hb.y
        ) {
          this.morrer();
        }
      }
    }

    }
        // é o ataque desse básico 
        if (this.estado === "idle") {
            this.sheet.linha = 0;
            this.sheet.coluna = 0;
            this.sheet.proximoQuadro();

            if (agora >= this.tempoProximoAtaque) {
                this.atirar();
                this.tempoProximoAtaque = agora + 1500;
            }
        }
    },

   atirar: function () {
    // precisa desses offsets pra ajustar de onde sai o osso
    let offsetX, offsetY;

    if (this.somTiro) {
    this.somTiro.currentTime = 0;
    this.somTiro.play().catch(() => {});
  }

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

    morrer: function () {
    if (this.morrendo || !this.vivo) return;
     // toca o som pré carregado
  if (this.somDano) {
    this.somDano.currentTime = 0; // reinicia o som do início
    this.somDano.play().catch(() => {});
  }
    this.morrendo = true;
    this.estado = "morrendo";
    this.sheet.linha = 1; 
    this.sheet.coluna = 0;
    this.frameMorte = 0;
    this.hitboxAtiva = false;
    console.log("Mr. Bones se foi");
    // pontos ao morrer
    if (window.hud) {
      window.hud.adicionarPontuacao(250);
    }
  },

    desenhar: function () {
        if (!this.vivo && !this.morrendo) return;
        this.sheet.desenhar(this.x, this.y, this.direcao !== this.ladoPadrao);
    
        // debug 
   /* const ctx = this.context;
    const hb = {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.largura,
      altura: this.altura,
    };

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);*/
  },
};