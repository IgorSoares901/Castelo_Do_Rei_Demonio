function Flecha(context, imagem, x, y, velocidade) {
  this.context = context;
  this.imagem = imagem;
  this.x = x;
  this.y = y;
  this.velocidade = velocidade;
  this.largura = imagem.width;
  this.altura = imagem.height;

  // offsets e tamanho ajustavel da hitbox
  this.offsetX = 5; // pros lados
  this.offsetY = 20; // pra cima e baixo
  this.hitboxLargura = 40;
  this.hitboxAltura = 8;
}

Flecha.prototype = {
  atualizar: function() {
    // A flecha anda pra esquerda
    this.x -= this.velocidade;

    // hitbox 
    const hb = {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.hitboxLargura,
      altura: this.hitboxAltura,
    };

    // colisão com a heroina
    if (window.heroina) {
      const h = {
        x: window.heroina.x + 27, // hitbox igual ao colisor dela
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
  console.log("Heroína atingida pela flecha!");
  this.animacao.excluirSprite(this);
  if (!window.heroina.invencivel) {
    window.heroina.tomarDano();
  }
  return;
}

    }

    // Se sair da tela, remove da animação
    if (this.x + this.largura < 0) {
      this.animacao.excluirSprite(this);
    }
  },

   desenhar: function() {
    const ctx = this.context;
    ctx.drawImage(this.imagem, this.x, this.y);

    // debug
    const hb = {
      x: this.x + this.offsetX,
      y: this.y + this.offsetY,
      largura: this.hitboxLargura,
      altura: this.hitboxAltura,
    };

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.strokeRect(hb.x, hb.y, hb.largura, hb.altura);

    // centro da hitbox
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(hb.x + hb.largura / 2, hb.y + hb.altura / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // mostrar posição e dimensões
    ctx.font = "10px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(
      `Flecha → x:${Math.round(hb.x)} y:${Math.round(hb.y)} w:${hb.largura} h:${hb.altura}`,
      hb.x,
      hb.y - 5
    );
  }
};