//arquivo HUD.js

function HUD(context, heroina, animacao) {
  this.context = context;
  this.heroina = heroina;
  this.animacao = animacao;
 
 
  this.imagemCoracao = new Image();
  this.imagemCoracao.src = "imagem/Vida.png"; // aqui vai a imagem do coração
  this.imagemHP = new Image();
  this.imagemHP.src = "imagem/carne.png"; // aqui vai a imagem do HP
 
 
  this.gameOverAtivo = false; // controla se o game over já foi ativado 
  this.tipo = 'hud'; // para identificar na animação
  this.pontuacao = 0; // pontuação inicial

  // som de game over pré-carregado
  this.somGameOver = new Audio("mp3/game-over.mp3");
  this.somGameOver.volume = 0.7;
  this.somGameOver.preload = "auto";
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

    //desenha os corações de HP
    var xHP = xInicial
    var yHP = y + 40;
    for (var j = 0; j < this.heroina.hp; j++) {
      ctx.drawImage(this.imagemHP, xHP + j * espacamento, yHP, 16, 16);
    }

    // // Texto de HP
    // ctx.font = "20px Arial bold";
    // ctx.fillStyle = "white";
    // ctx.fillText("HP: " + this.heroina.hp, 50, 70);

    //espaço para pontuação

    
    ctx.fillText("Pontos: " + this.pontuacao, 60, 100);
    ctx.font = "25px 'AnotherDanger'";
    ctx.fillStyle = "white";
    ctx.fillText("Enter " , 460, 30);
    

   // coisa de game over

    //GAME OVER — só mostra se ela realmente morreu e vidas == 0
    if (this.heroina.vidas <= 0 && this.heroina.hp <= 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.font = "50px 'AnotherDanger'";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.fillStyle = "white";
      ctx.font = "19px 'Sancreek'";
      ctx.fillText("Pressione  Enter  para reiniciar", ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
      // colocar a pontuação final
      ctx.font = "19px 'Sancreek'";
      ctx.fillText("Pontuação Final: " + this.pontuacao, ctx.canvas.width / 2, ctx.canvas.height / 2 + 100);
      ctx.fillStyle = "white";
      // pausa o jogo e espera o enter para reiniciar
      if (!this.gameOverAtivo) {
        this.gameOverAtivo = true;
        this.animacao.desligar();

        // pausa a música de fundo global, se existir
        if (typeof musicaFundo !== "undefined" && musicaFundo && !musicaFundo.paused) {
        musicaFundo.pause();
        musicaFundo.currentTime = 0;
}
        // toca o som de game over uma vez
    if (this.somGameOver) {
      this.somGameOver.currentTime = 0;
      this.somGameOver.play().catch(() => {});
    }

       // tecla pra reiniciar agora não buga mais
      const reiniciarListener = (e) => {
      if (e.code === "Enter") {
      this.resetarJogo();
      window.removeEventListener("keydown", reiniciarListener);
  }
};
      window.addEventListener("keydown", reiniciarListener);
      }
    }

    // 🔙 Restaura o estado anterior (volta a câmera)
    ctx.restore();
  },

  // metedo para atrituir pontos
  adicionarPontuacao: function (pontos) {
    this.pontuacao += pontos;
  },

  resetarPontuacao: function () {
    this.pontuacao = 0;
  },

  resetarJogo: function () {
    // Para o som de game over imediatamente
    if (this.somGameOver && !this.somGameOver.paused) {
    this.somGameOver.pause();
    this.somGameOver.currentTime = 0;
}
    // Pausa a animação para fazer a limpeza com segurança
    if (this.animacao && typeof this.animacao.desligar === "function")
      this.animacao.desligar();

    // Limpa a lista de sprites (vai remover inimigos, projéteis etc.)
    if (this.animacao && Array.isArray(this.animacao.sprites)) {
      this.animacao.sprites = [];
    }

    // Reseta possíveis valores da câmera
    if (this.animacao && this.animacao.cam) {
      this.animacao.cam.x = 0;
      this.animacao.cam.y = 0;
      this.animacao.camera = null;
    }

    // Reseta a variável global da câmera (definida em heroina.html)
    if (typeof camera !== 'undefined') {
      camera.x = 0;
      camera.y = 0;
    }

    // Limpa blocos do colisor (se existir)
    // vamos recriar o colisor por completo mais abaixo; se existir, limpamos agora
    if (typeof colisor !== "undefined" && colisor && Array.isArray(colisor.blocos)) {
      colisor.blocos = [];
    }

    // Recria/reaquipa o parallax e o mapa (fundo)
    try {
      // Parallax: recria se a classe existir
      if (typeof Parallax === 'function') {
        // cria novo parallax usando o contexto do HUD
        window.parallax = new Parallax(this.context);
        // adiciona camadas se as imagens existirem (mesmo args usados em heroina.html)
        try {
          if (typeof imgNuvens !== 'undefined') parallax.adicionarCamada(imgNuvens, 0.5, 0.5, 1, 1000);
          if (typeof nuvensLayer3 !== 'undefined') parallax.adicionarCamada(nuvensLayer3, 1.50, 8, 75);
          if (typeof nuvensLayer3 !== 'undefined') parallax.adicionarCamada(nuvensLayer3, 4.50, 75);
        } catch (e) {
          console.warn('resetarJogo: erro ao configurar camadas de parallax', e);
        }

        // adiciona o parallax como fundo (índice 0)
        if (this.animacao && typeof this.animacao.inserirFundo === 'function') {
          this.animacao.inserirFundo({
            atualizar: function() { parallax.atualizar(); },
            desenhar: function() { parallax.desenhar(); }
          }, 0);
        }
      }

      // Mapa: reusa `mapa` global se existir, senão cria um mapa simples
      // aqui é recriado apenas para garantir que o mapa exista
      if (typeof mapa !== 'undefined') {
        if (this.animacao && typeof this.animacao.inserirFundo === 'function')
          this.animacao.inserirFundo(mapa, 1);
      } else if (typeof imgMapa !== 'undefined') {
        // cria objeto mapa mínimo
        window.mapa = {
          context: this.context,
          imagem: imgMapa,
          x: 0,
          y: 19,
          width: 5000,
          height: 500,
          atualizar: function() {},
          desenhar: function() { this.context.drawImage(this.imagem, this.x, this.y); }
        };
        if (this.animacao && typeof this.animacao.inserirFundo === 'function')
          this.animacao.inserirFundo(mapa, 1);
      }
    } catch (e) {
      console.warn('resetarJogo: erro ao recriar fundo/parallax', e);
    }

    // Limpa arrays globais de inimigos/projéteis para evitar referências antigas
    window.arqueiros = [];
    window.esqueletos = [];
    window.godos = [];
    window.chefe = [];

    // Recriar o colisor e seus blocos (mesmos blocos definidos em heroina.html)
    try {
      window.colisor = new Colisor(this.context, this.heroina);

      // blocos do mapa (copiados de heroina.html)
      colisor.adicionarBloco(0, 402, 5000, 50, "chao"); // chão
      colisor.adicionarBloco(0, 0, 5, 500, "parede");  // extremidade inicial
      colisor.adicionarBloco(4990, 0, 10, 500, "parede");  // extremidade final
      colisor.adicionarBloco(55, 336, 82, 15, "plataforma"); // plataforma 1
      colisor.adicionarBloco(137, 325, 207, 17, "plataforma"); // plataforma 2
      colisor.adicionarBloco(232, 293, 17, 105, "parede");  // parede 1
      colisor.adicionarBloco(345, 336, 95, 17, "plataforma"); // plataforma 3
      colisor.adicionarBloco(1056, 336, 80, 17, "plataforma"); // plataforma 4
      colisor.adicionarBloco(1137, 325, 207, 17, "plataforma"); // plataforma 5
      colisor.adicionarBloco(1232, 293, 17, 105, "parede");  // parede 2
      colisor.adicionarBloco(1345, 336, 95, 17, "plataforma"); // plataforma 6
      colisor.adicionarBloco(1479, 310, 22, 5, "plataforma"); // plataforma mini 2 logo
      colisor.adicionarBloco(1495, 300, 5, 5, "plataforma"); // plataforma mini 3
      colisor.adicionarBloco(1500, 290, 30, 5, "plataforma"); // plataforma mini 4
      colisor.adicionarBloco(1547, 290, 15, 5, "plataforma"); // plataforma mini 5
      colisor.adicionarBloco(1547, 291, 1450, 2, "chao"); // chão de cima
      colisor.adicionarBloco(3640, 327, 25, 80, "parede");  // parede 3
      colisor.adicionarBloco(3738, 327, 25, 80, "parede");  // parede 4
      colisor.adicionarBloco(3883, 327, 25, 80, "parede");  // parede 5
      colisor.adicionarBloco(3968, 327, 25, 80, "parede");  // parede 6
      colisor.adicionarBloco(4259, 374, 35, 30, "parede");  // escada 1
      colisor.adicionarBloco(4290, 346, 35, 30, "parede");  // escada 2
      colisor.adicionarBloco(4322, 316, 35, 30, "parede");  // escada 3
      colisor.adicionarBloco(4352, 286, 35, 30, "parede");  // escada 4
      colisor.adicionarBloco(4382, 256, 30, 30, "parede");  // escada 5
      colisor.adicionarBloco(4382, 260, 650, 30, "chao"); // chão final
      colisor.adicionarBloco(4500, 13, 10, 206, "parede");  // parede chefe
      colisor.adicionarBloco(4536, 203, 47, 15, "plataforma"); // plataforma chefe
      colisor.adicionarBloco(4619, 175, 47, 15, "plataforma"); // plataforma mini 2
      colisor.adicionarBloco(4690, 174, 47, 15, "plataforma"); // plataforma mini 3
      colisor.adicionarBloco(4780, 174, 47, 15, "plataforma"); // plataforma mini 4
      colisor.adicionarBloco(4850, 174, 47, 15, "plataforma"); // plataforma mini 5
      colisor.adicionarBloco(4915, 202, 47, 15, "plataforma"); // plataforma mini 6
      colisor.adicionarBloco(4500, 13, 500, 10, "plataforma"); // teto chefe

      // integra o colisor à animação (atualizar e desenhar)
      if (this.animacao && typeof this.animacao.novoSprite === 'function') {
        this.animacao.novoSprite({
          atualizar: function () { colisor.checarColisoes(); },
          desenhar: function () { colisor.desenhar(); }
        });
      }
    } catch (e) {
      console.warn('resetarJogo: erro ao recriar colisor', e);
    }

    // Limpa arrays globais de inimigos/projéteis para evitar referências antigas
    window.arqueiros = [];
    window.esqueletos = [];
    window.godos = [];
    window.chefe = [];

    // Reseta a pontuação
    this.resetarPontuacao();
    // Reseta o estado da heroína
    if (this.heroina) {
      this.heroina.vidas = 3;
      this.heroina.hp = 5;
      this.heroina.viva = true;
      this.heroina.morrendo = false;
      this.heroina.x = -13;
      this.heroina.y = 330;
      this.heroina.velocidadeY = 0;
      this.heroina.pulando = false;
      this.heroina.invencivel = false;
      this.heroina.atacando = false;
      // reset de animação da spritesheet se existir
      if (this.heroina.sheet) {
        this.heroina.sheet.linha = 1;
        this.heroina.sheet.coluna = 0;
      }
    }

    // Garante que o HUD global aponte para este objeto
    window.hud = this;

    // Re-adiciona a heroína à animação e a define como foco da câmera
    if (this.animacao && typeof this.animacao.novoSprite === "function") {
      this.animacao.novoSprite(this.heroina);
      // Força a heroína como foco da câmera
      this.animacao.camera = this.heroina;

      // Reseta a câmera global (usada em heroina.html)
      if (typeof camera !== "undefined" && typeof canvas !== "undefined") {
        camera.x = this.heroina.x - canvas.width / 2 + 50;
        camera.y = 0;
        // Garante que a câmera não saia dos limites do mundo
        if (camera.x < 0) camera.x = 0;
        if (camera.mundoLargura && camera.largura && 
            camera.x + camera.largura > camera.mundoLargura) {
          camera.x = camera.mundoLargura - camera.largura;
        }
      }
    }

    // Recria inimigos/chefe se as funções de criação existirem
    try {
      if (typeof criarArqueiros === "function") criarArqueiros();
      if (typeof criarEsqueletos === "function") criarEsqueletos();
      if (typeof criarGodos === "function") criarGodos();
      if (typeof criarChefe === "function") criarChefe();
    } catch (e) {
      // se algo falhar ao recriar inimigos, só logamos no console para depuração
      console.warn("resetarJogo: erro ao recriar inimigos", e);
    }

    // Garantir que o game-over foi desativado e reiniciar a animação
    this.gameOverAtivo = false;
    if (this.animacao && typeof this.animacao.ligar === "function")
      this.animacao.ligar();

    // Retoma a música de fundo principal
  if (typeof musicaFundo !== "undefined" && musicaFundo) {
  musicaFundo.currentTime = 0;
  musicaFundo.play().catch(() => {});
}
  }
};
