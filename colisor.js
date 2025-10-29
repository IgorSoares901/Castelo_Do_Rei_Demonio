function Colisor(context, heroina) {
  this.context = context;
  this.heroina = heroina;
  this.blocos = []; // blocos do cenário
}

Colisor.prototype = {
  // adiciona um bloco (parede, chão, plataforma)
  adicionarBloco: function (x, y, largura, altura, tipo) {
    this.blocos.push({ x, y, largura, altura, tipo });
  },

  checarColisoes: function () {
    const h = {
      x: this.heroina.x + 27, // posição da hitbox
      y: this.heroina.y + 37,
      largura: 20,
      altura: 42,
      
    };

    let noChao = false;

    for (const b of this.blocos) {
      const colide =
        h.x < b.x + b.largura &&
        h.x + h.largura > b.x &&
        h.y < b.y + b.altura &&
        h.y + h.altura > b.y;

      if (colide) {
        // determinar o eixo de menor sobreposição
        const overlapX =
          h.x + h.largura / 2 - (b.x + b.largura / 2);
        const overlapY =
          h.y + h.altura / 2 - (b.y + b.altura / 2);

        const halfWidths = (h.largura + b.largura) / 2;
        const halfHeights = (h.altura + b.altura) / 2;

       const dx = halfWidths - Math.abs(overlapX);
const dy = halfHeights - Math.abs(overlapY);

if (dx < dy) {
  // --- COLISÃO HORIZONTAL (paredes) ---
  if (overlapX > 0) {
    // heroína à direita do bloco → empurra para a direita
    this.heroina.x += dx;
  } else {
    // heroína à esquerda do bloco → empurra para a esquerda
    this.heroina.x -= dx;
  }
} else {
  // --- COLISÃO VERTICAL (chão ou teto) ---
  if (overlapY > 0) {
    // heroína abaixo do bloco → bateu a cabeça
    this.heroina.y += dy;
    this.heroina.velocidadeY = 0;
  } else {
    // heroína acima do bloco → está no chão
    this.heroina.y -= dy;
    this.heroina.velocidadeY = 0;
    this.heroina.pulando = false;
    noChao = true;
  }
}
      }
    }
    // gravidade
    if (!noChao) {
      this.heroina.velocidadeY = (this.heroina.velocidadeY || 0) + 0.5;
      this.heroina.y += this.heroina.velocidadeY;
    }
  },

  // desenha blocos (debug visual)
  desenhar: function () {
   const ctx = this.context;

  // === desenha blocos do cenário ===
  for (const b of this.blocos) {
    ctx.fillStyle =
      b.tipo === "chao"
        ? "brown"
        : b.tipo === "parede"
        ? "darkred"
        : "purple"; // plataforma
    ctx.fillRect(b.x, b.y, b.largura, b.altura);
  }

  // desenha hitbox da heroína 
  const h = {
    x: this.heroina.x + 27, // mesmos valores do checarColisoes
    y: this.heroina.y + 37,
    largura: 20,
    altura: 42,
  };

  // contorno
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 2;
  ctx.strokeRect(h.x, h.y, h.largura, h.altura);

  // centro do retângulo
  ctx.fillStyle = "aqua";
  ctx.beginPath();
  ctx.arc(h.x + h.largura / 2, h.y + h.altura / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // opcional: mostrar posição e dimensões na tela
  ctx.font = "10px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(
    `x:${Math.round(h.x)} y:${Math.round(h.y)} w:${h.largura} h:${h.altura}`,
    h.x,
    h.y - 5
  );
}
};