//arquivo HUD.js

function HUD(context, heroina, animacao) {
  this.context = context;
  this.heroina = heroina;
  this.animacao = animacao;
  this.imagemCoracao = new Image();
  this.imagemCoracao.src = "imagem/Vida.png"; // aqui vai a imagem do coração
}

HUD.prototype = {
  desenhar: function () {
    var ctx = this.context;

    //Salva o estado atual (com o deslocamento da câmera)
    ctx.save();

    // 🧩 Reseta a transformação — assim o HUD fica fixo na tela
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    var xInicial = 20;
    var y = 20;
    var espacamento = 35;

    //Desenha corações de acordo com as vidas
    for (var i = 0; i < this.heroina.vidas; i++) {
      ctx.drawImage(this.imagemCoracao, xInicial + i * espacamento, y, 30, 30);
    }

    // Texto de HP
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("HP: " + this.heroina.hp, 20, 70);

    //espaço para pontuação
    ctx.fillText("Pontos: " + this.heroina.pontuacao, 20, 100);

   // coisa de game over

    //GAME OVER — só mostra se ela realmente morreu e vidas == 0
    if (this.heroina.vidas <= 0 && this.heroina.hp <= 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "red";
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.font = "25px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Pressione Enter para reiniciar", ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);

      // pausa o jogo e espera o enter para reiniciar
      if (!this.gameOverAtivo) {
        this.gameOverAtivo = true;
        this.animacao.desligar();

        // tecla pra reiniciar
        window.addEventListener(
          "keydown",
          (e) => {
            if (e.code === "Enter") {
              this.heroina.vidas = 3;
              this.heroina.hp = 5;
              this.heroina.viva = true;
              this.heroina.x = 100; // reinicia posição
              this.heroina.y = 300;
              this.gameOverAtivo = false;
              this.animacao.ligar();
            }
          },
          { once: true }
        );
      }
    }

    // 🔙 Restaura o estado anterior (volta a câmera)
    ctx.restore();
  },
};
