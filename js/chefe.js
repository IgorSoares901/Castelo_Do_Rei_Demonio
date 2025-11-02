function Chefe(context, imagem, animacao, camera) {
  this.context = context;
  this.animacao = animacao;
  this.camera = camera;

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
  this.cooldownAtaque = Date.now() + 2100;

  // colisão
  this.colisor = null;
  this.largura = 83;
  this.altura = 50;
  this.offsetX = 73;  
  this.offsetY = 180; // além disso tive que usar a mesma colisão que a heroina para ir

  // hp
  this.hp = 10;
  this.vivo = true;
  this.morrendo = false;
  this.recebendoDano = false;
  this.invencivel = 0;
  this.tempoInvencivel = 0;
  this.alphaPiscar = 1;

  // controle da animaçao de morte 
  this.frameMorte;

}

Chefe.prototype = {
  atualizar: function () {
    if (this.morrendo) {
  this.animarMorte();
  return;
}
    if (!this.vivo && !this.morrendo) return;

    const agora = Date.now();
    const hero = window.heroina;
    if (!hero) return;

    // invencbilidade
    if (this.invencivel) {
      this.alphaPiscar = Math.floor(Date.now() / 100) % 2 === 0 ? 0.4 : 1;
      if (Date.now() > this.tempoInvencivel) {
        this.invencivel = false;
        this.alphaPiscar = 1;
      }
    }

    //morte
    if(this.morrendo) {
      this.animarMorte()
      return;
    }

    // levou dano da heroina
    if (!this.invencivel && hero && hero.danoAtivo && hero.viva) {
      const hit = hero.retanguloAtaque();
      if (hit) {
        const hb = {
          x: this.x + this.offsetX,
          y: this.y + this.offsetY,
          largura: this.largura,
          altura: this.altura,
         };
         
         if (
          hit.x < hb.x + hb.largura &&
          hit.x + hit.largura > hb.x &&
          hit.y < hb.y + hb.altura &&
          hit.y + hit.altura > hb.y
         ) {
          this.tomarDano();
         }
      }
    }

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
    //this.direcao = (this.direcao === "esquerda") ? "direita" : "esquerda"; essa linha de código buga o chefe
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
        this.cooldownAtaque = agora + 2100;
      }

      this.yAnterior = this.y;
      return;
    }

    if (this.estado === "idle") {
      this.sheet.linha = 1;
      this.sheet.proximoQuadro();

      if (agora >= this.cooldownAtaque) {
       const distancia = hero.x - this.x;

  if (hero.x - 50 < this.x) {
  this.direcao = "esquerda";
} else if (hero.x > this.x + 0) {
  this.direcao = "direita";
} // com esses valores o chefe enfim não foge da heroina

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
  this.velocidadeX = 5.0;

  this.yAnterior = this.y;
},

tomarDano: function () {
  if (this.recebendoDano || this.invencivel || !this.vivo || this.morrendo) return;

  this.hp--; // essas coisas aqui que tiram o hp
  console.log(`chefe tomou dano, HP restante:{this.hp}`);

  if (this.hp <= 0) {
    this.morrer();
    return;
  }

  this.recebendoDano = true;
  this.invencivel = true;
  this.tempoInvencivel = Date.now() + 1000; // invencibilidade
  this.alphaPiscar = 1;

  setTimeout(() => {
    this.recebendoDano = false;
  }, 200);
},

// morrendo
morrer: function () {
  if (this.morrendo || !this.vivo) return;
  this.morrendo = true;
  this.vivo = false;
  this.estado = "morrendo";
  this.sheet.linha = 2; 
  this.sheet.coluna = 0;
  this.sheet.intervalo = 120; // mais lento para ver
  this.frameMorte = 0;
  console.log("Godofredo foi pro céu! POGGERS!");
},

animarMorte: function () {
  // esse % ta avançando os quadros da animação quanto maior mais lento
  if (++this.frameMorte % 10 === 0) {
    this.sheet.coluna++;
    console.log("Tchau Godofredo", this.sheet.coluna);
  }

  // impede ultrapassar o último frame (coluna 2)
  if (this.sheet.coluna >= 3) {
    console.log("Godofredo morreu (fim da animação).");
    this.animacao.excluirSprite(this);
    this.morrendo = false;
    this.vivo = false;

    // cria o item de vitória no centro do corpo do chefe
if (typeof Fim === "function") {
  const imgFim = new Image();
  imgFim.src = "imagem/fim.png";

  const itemFim = new Fim(this.context, imgFim, this.animacao, window.sonic);

  // Calcula o centro do corpo do chefe
  const centroX = this.x + this.offsetX + this.largura / 2 - itemFim.largura / 2;
  const centroY = this.y + this.offsetY + this.altura / 2 - itemFim.altura / 2;

  itemFim.x = centroX;
  itemFim.y = centroY;

  // adiciona gravidade simples pra ele cair
  itemFim.velocidadeY = -5; // pequeno impulso pra cima
  itemFim.gravidade = 0.3;
  itemFim.colisor = this.colisor;

  // substitui o atualizar() pra incluir a queda
  itemFim.atualizar = function () {
    if (this.coletado || !this.ativo) return;

    this.velocidadeY += this.gravidade;
    this.y += this.velocidadeY;

    // mantém a detecção de colisão com a heroína
    // verifica colisão com o chão real
    if (this.colisor && this.colisor.blocos) {
      for (const b of this.colisor.blocos) {
        if (b.tipo !== "chao") continue;

        // hitbox do item e do bloco
        const hb = { x: this.x, y: this.y, largura: this.largura, altura: this.altura };
        const bb = { x: b.x, y: b.y, largura: b.largura, altura: b.altura };

        // detecção de colisão simples
        if (
          hb.x < bb.x + bb.largura &&
          hb.x + hb.largura > bb.x &&
          hb.y < bb.y + bb.altura &&
          hb.y + hb.altura > bb.y
        ) {
          // parou em cima do chão
          this.y = b.y - this.altura;
          this.velocidadeY = 0;
          break;
        }
      }
    }

    // colisão com heroína (mesmo de antes)
    const h = {
      x: this.heroina.x + 27,
      y: this.heroina.y + 40,
      largura: 20,
      altura: 42
    };
    const fim = { x: this.x, y: this.y, largura: this.largura, altura: this.altura };

    if (
      h.x < fim.x + fim.largura &&
      h.x + h.largura > fim.x &&
      h.y < fim.y + fim.altura &&
      h.y + h.altura > fim.y
    ) {
      this.coletar();
    }
  };

  this.animacao.novoSprite(itemFim);
}

  }
},
  desenhar: function () {
    const ctx = this.context;
   ctx.save();
   ctx.globalAlpha = (this.morrendo ? 1 : (this.invencivel ? this.alphaPiscar : 1));
   this.sheet.desenhar(this.x, this.y, this.direcao === "esquerda");
   ctx.restore();

    // debug
   /* const hb = {
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
    ctx.restore();*/
  },
};
