function Fim(context, imagem, animacao, heroina) {
    this.context = context;
    this.imagem = imagem; 
    this.animacao = animacao;
    this.heroina = heroina;
    this.x = 0;
    this.y = 0;
    this.largura = 16;
    this.altura = 16;
    this.ativo = true;
    this.coletado = false;
}

Fim.prototype = {
    atualizar: function() {
        if (!this.ativo || this.coletado) return;
        
  // verifica a colisão com a heroina
  const h = { 
  x: this.heroina.x + 27, 
  y: this.heroina.y + 40, 
  largura: 20, 
  altura: 42 
};

// hitbox do item fim
const fim = { 
  x: this.x, 
  y: this.y, 
  largura: 16, 
  altura: 16 
};

// colisão 
if (
  h.x < fim.x + fim.largura &&
  h.x + h.largura > fim.x &&
  h.y < fim.y + fim.altura &&
  h.y + h.altura > fim.y
) {
  // TOCOU NO ITEM!
  this.coletar();
}
    },
 
  desenhar: function () {
    if (!this.ativo || this.coletado) return;
    this.context.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
  },

  coletar: function () {
    this.coletado = true;
    this.ativo = false;

    // pausa a animação
    if (this.animacao && typeof this.animacao.desligar === "function") {
        this.animacao.desligar();
    }

    // troca a musica de fundo
    try {
        if (this.animacao.musicaFundo) {
            this.animacao.musicaFundo.pause();
        }

    const musicaVitoria = new Audio("mp3/vitoria.mp3");
    musicaVitoria.loop = true;
    musicaVitoria.volume = 0.6;
    musicaVitoria.play().catch(() => {});
    } catch (e) {
        console.warn("Erro ao trocar música:", e)
    } // se não encontrar a musica avisa no console

   setTimeout(() => {
    const ctx = this.context;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "italic bold 35px Arial bold";
    ctx.textAlign = "center";
    ctx.fillText(
      "A longa noite chegou a um fim...",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2
    );

    ctx.fillStyle = "white";
    ctx.font = "16px Arial bold";
    ctx.fillText(
      "Recarregue a página para jogar novamente",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 + 50
    );
    ctx.restore();
  }, 100); // espera 100 ms pra garantir que o loop parou, precisou disso pro texto aparecer
}
};