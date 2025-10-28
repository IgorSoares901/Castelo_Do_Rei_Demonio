var HEROINA_DIREITA = 1;

var HEROINA_ESQUERDA = 2;

var HEROINA_PULANDO = 3;

var HEROINA_PULANDO_DIREITA = 4;

var HEROINA_PULANDO_ESQUERDA = 5;

var HEROINA_ATAQUE = 6;


function Sonic(context, teclado, imagem) { 

   this.context = context; 

   this.teclado = teclado; 

   this.x = 0; 

   this.y = 0; 

   this.velocidade = 2.3;

   this.atacando = false;

   this.frameAtaque = 0;

   this.hitboxAtaque = null; // retangulo do golpe atual

   this.hitboxAtaqueDireita = { x: 0, y: 0, largura: 40, altura: 40};
   this.hitboxAtaqueEsquerda = { x: 0, y: 0, largura: 40, altura: 40};

   this.danoAtivo = false; // indica se o ataque pode causar dano

   // Criando a spritesheet a partir da imagem recebida

   this.sheet = new Spritesheet(context, imagem, 6, 10, [10, 8, 8, 10, 2, 10], 0.65); // tive que colocar o array aqui dentro para definir os frames somente dela

   this.sheet.intervalo = 120; // velocidade da animação

   this.hp = 5; // total de hp, tem que mudar no respawn tbm!!!!

   this.viva = true;

   this.morrendo = false;

   this.vidas = 3; // total de vidas

   // Estado inicial

   this.andando = false;

   this.direcao = HEROINA_DIREITA;

   // dano
   this.recebendoDano = false;

   this.invencivel = 0;

   this.frameDano = 0;

   this.alphaPiscar = 1; // ela vai ficar piscando após receber dano

} 

Sonic.prototype = { 

   atualizar: function() {
    if (!this.viva) return;
    //invencibilidade
        if (this.invencivel) {
    // pisca quando leva ataque
    this.alphaPiscar = (Math.floor(Date.now() / 100) % 2 === 0) ? 0.3 : 1; // a cada 100 milesegundos ela ira piscar
    // enquanto esta piscando ela é invencivel
         if (Date.now() > this.tempoInvencivel) {
    this.invencivel = false;
            this.alphaPiscar = 1;
        }
    }

    // recebendo dano
    if (this.recebendoDano) {
        if (++this.frameDano % 10 === 0) {
            this.sheet.coluna++;
        if (this.sheet.coluna >= 2) {
            this.sheet.coluna = 0;
            this.recebendoDano = false;
        }
        }
        return; // não faz nada enquanto leva dano
    }

    // morte 
    if (this.morrendo) {
        if (++this.frameDano % 6 === 0) this.sheet.coluna++;
        if (this.sheet.coluna >=10) {
            this.viva = false;
            this.morrendo = false;
            console.log('Morreu');
        }
            return;
        }
        
    // verifica colisões com a flecha e o arqueiro
    if (!this.invencivel) {
        // flechas
        if (window.arqueiros) {
            for (const arqueiro of window.arqueiros) {
                if (!arqueiro.vivo) continue;

        // colisao com a hitbox do arqueiro
        const a ={
            x: arqueiro.x + arqueiro.offsetX,
            y: arqueiro.y + arqueiro.offsetY,
            largura: arqueiro.largura,
            altura: arqueiro.altura,
        };

        const h = {x: this.x + 27, y: this.y + 37, largura: 20, altura: 42 };
        if (
            h.x < a.x + a.largura &&
            h.x + h.largura > a.x &&
            h.y < a.y + a.altura &&
            h.y + h.altura > a.y
        ){
            this.tomarDano();
            break;
        }
            }
        }

        // flechas ativas
        if (this.animacao && this.animacao.sprites) {
            for (const sprite of this.animacao.sprites){
                if (sprite.constructor.name === "Flecha") {
                    const f = {
                        x: sprite.x + sprite.offsetX,
                        y: sprite.y + sprite.offsetY,
                        largura: sprite.hitboxLargura,
                        altura: sprite.hitboxAltura,
                    };
            const h = {x: this.x + 27, y: this.y + 37, largura: 20, altura: 42};
            if (
                h.x < f.x + f.largura &&
                h.x + h.largura > f.x &&
                h.y < f.y + f.altura &&
                h.y + h.altura >f.y
            ) {
                sprite.animacao.excluirSprite(sprite);
                this.tomarDano();
                break;
            }
                }
            }
        }
    }
    // o pulo teve que vir primeiro senão bugava tudo
if (this.teclado.pressionada(SETA_CIMA) && !this.pulando) {

    this.pulando = true;

    this.velocidadeY = -10; // isso aqui é a força inicial do pulo

    this.yInicial = this.y;  // ta gravando onde fica o chão

    this.alturaMaxima = this.yInicial - 50; // altura máxima que eu coloquei para o pulo

    this.sheet.linha = 0;  

    this.sheet.coluna = 0; // linha e coluna da animação de pulo
}

// Física para ela pular com gravidade
if (this.pulando) {
    this.y += this.velocidadeY;
    this.velocidadeY += 0.3; // gravidade quanto maior mais rapido ela vai cair

    if(this.teclado.pressionada(SETA_DIREITA)) {
        this.x += this.velocidade * 1.3; // fica mais lenta no ar
        this.direcao = HEROINA_DIREITA;
        this.estado = HEROINA_PULANDO_DIREITA;
    }

    else if(this.teclado.pressionada(SETA_ESQUERDA)) {
        this.x -= this.velocidade * 1.3;
        this.direcao = HEROINA_ESQUERDA;
        this.estado = HEROINA_PULANDO_ESQUERDA;
    }

    // Sobe usando os frames 0 ate o 5
    if (this.velocidadeY < 0) {
        const progresso = (this.yInicial - this.y) / 75; // é a altura máxima do pulo
        this.sheet.coluna = Math.min(5, Math.floor(progresso * 5)); // o Math.min é para não passar do frame 5 e o Math.floor é arredondando de cima para baixo
    }
    // Desce usando os frames frames 5 até 9
    else {
        const progresso = (this.y - this.alturaMaxima) / 75; 
        this.sheet.coluna = 5 + Math.min(4, Math.floor(progresso * 5)); // funciona igual o de cima
    }

    // Chegou ao chão
    if (this.y >= this.yInicial) {
        this.y = this.yInicial;
        this.velocidadeY = 0;
        this.pulando = false;

        // Retorna à animação anterior quando ela chegar no chão
        this.sheet.coluna = 0;

        if (this.teclado.pressionada(SETA_DIREITA)) {
            this.sheet.linha = 2; // andar direita
        } else if (this.teclado.pressionada(SETA_ESQUERDA)) {
            this.sheet.linha = 2; // andar esquerda (espelhar no draw)
        } else {
            this.sheet.linha = 1; // idle
        }
    }

    // Sai do atualizar pq senão quebra e buga tudo UwU
    return;
}

// Ataque em si
        if (this.teclado.pressionada(ESPACO) && !this.atacando && !this.pulando) {
            this.atacando = true;
            this.sheet.linha = 3; // Linha onde começa o ataque
            this.sheet.coluna = 0; // Primeiro quadro do ataque
            this.frameAtaque = 0; // Contador de frames do ataque
        }

        // o avance dos quadros de ataque
        if(this.atacando) {
            if (++this.frameAtaque % 2 !== 0) {
                this.sheet.coluna++;
            } // Esse % serve tanto para controlar a velocidade do ataque e quanto maior for o número mais lenta ela vai ser

            // ativa a hitbox do ataque entre os frames 5 e 9
        if(this.sheet.coluna >= 5 && this.sheet.coluna <= 9) {
            this.danoAtivo = true;

           if (this.direcao === HEROINA_DIREITA) {
            this.hitboxAtaqueDireita.x = this.x + 20 // posição base
            this.hitboxAtaqueDireita.y = this.y + 50;
            this.hitboxAtaqueDireita.largura = (this.sheet.coluna === 9) ? 65 : 50 // cresce no frame 9 o ? é um if else
            this.hitboxAtaqueDireita.altura = 30;
        } else {
            this.hitboxAtaqueEsquerda.x = this.x + 0;  // posição mais à esquerda
            this.hitboxAtaqueEsquerda.y = this.y + 50;
            this.hitboxAtaqueEsquerda.largura = (this.sheet.coluna === 9) ? 50 : 50;
            this.hitboxAtaqueEsquerda.altura = 30;
        }
    } else {
        this.danoAtivo = false;
    }

            // final dos quadros de ataque
            if (this.sheet.coluna > 9) {
                this.sheet.coluna = 0;
                this.atacando = false // quando chegar no ultimo quadro de ataque termina

                // código para ela poder voltar ao estado anterior ao ataque
                if (this.teclado.pressionada(SETA_DIREITA)) {
                    this.sheet.linha = 2;
                } else if (this.teclado.pressionada(SETA_ESQUERDA)) {
                    this.sheet.linha = 2;
                } else {
                    this.sheet.linha = 1;
                }
            } 

            return; // impede outras animações enquanto ataca

        }

        // ANDAR PARA DIREITA
       else if (this.teclado.pressionada(SETA_DIREITA)) {
            if (!this.andando || this.direcao !== HEROINA_DIREITA) {
                this.sheet.linha = 2;   // linha 1: andar
                this.sheet.coluna = 0;
            }
            this.andando = true;
            this.direcao = HEROINA_DIREITA;
            this.sheet.proximoQuadro();
            this.x += this.velocidade;
        }

        // ANDAR PARA ESQUERDA (espelhado)
        else if (this.teclado.pressionada(SETA_ESQUERDA)) {
            if (!this.andando || this.direcao !== HEROINA_ESQUERDA) {
                this.sheet.linha = 2;   // mesma linha da direita
                this.sheet.coluna = 0;
            }
            this.andando = true;
            this.direcao = HEROINA_ESQUERDA;
            this.sheet.proximoQuadro();
            this.x -= this.velocidade;
        }

        // PARADA (IDLE LOOP)
        else {
            this.andando = false;

            // Linha 0: animação de idle
            this.sheet.linha = 1;
            this.sheet.proximoQuadro();
        }

    },

    // funcao de tomar dano
    tomarDano: function() {
  if (this.recebendoDano || this.invencivel || this.morrendo || !this.viva) return;
  
  this.hp--;

  if(this.hp <= 0) {
    this.morrer();
    return; // se o hp chegar em 0 ela morre
  }

  this.recebendoDano = true;
  this.sheet.linha = 4; // linha da animação de dano
  this.sheet.coluna = 0;
  this.frameDano = 0;

  // pequeno recuo
  const direcaoKnock = (this.direcao === HEROINA_DIREITA) ? -15 : 15;
  this.x += direcaoKnock;
  this.y -= 5; // leve impulso pra cima

  this.invencivel = true;
  this.tempoInvencivel = Date.now() + 1500;
  this.alphaPiscar = 1; // invencibilidade dela

  console.log('Heroína tomou dano! Vida restante: ${this.hp}');
},

morrer: function() {
    if(this.morrendo || !this.viva) return;
    this.morrendo = true;
    this.recebendoDano = false;
    this.atacando = false;
    this.invencivel = false;
    this.sheet.linha = 5;
    this.sheet.coluna = 0;
    this.frameDano = 0;
    console.log("virou camisa de saudade")

    const duracaoAnim = 1000; // tempo pra ela reaparecer
    setTimeout(() => {
    this.viva = false;
    this.morrendo = false;
    this.vidas--;
        if (this.vidas > 0) {
            this.respawn(); // reaparece no mesmo lugar
        } else {
            console.log("Jogo acabou.");
        }
    }, duracaoAnim);
},

respawn: function() {
    console.log("Respawna");

    this.viva = true;
    this.morrendo = false;
    this.recebendoDano = false;
    this.invencivel = false;
    this.hp = 5; // tem que mudar o hp aqui tbm no respawn
    this.velocidadeY = 0;

    // volta para idle
    this.sheet.linha = 1;
    this.sheet.coluna = 0;

    // invencível por 1 segundo ao reaparecer
    this.invencivel = true;
    this.tempoInvencivel = Date.now() + 1000;
},

retanguloAtaque: function () {
    if (!this.danoAtivo) return null; // só dano ao atacar
    if (this.direcao === HEROINA_DIREITA) {
        const h = this.hitboxAtaqueDireita;
        return { x: h.x, y :h.y, largura: h.largura, altura: h.altura};
    } else {
        const h = this.hitboxAtaqueEsquerda;
        return { x: h.x, y :h.y, largura: h.largura, altura: h.altura};
    }
}, 

   desenhar: function () {
  const ctx = this.context;

  // desenha a sprite
  ctx.save();
  ctx.globalAlpha = this.invencivel ? this.alphaPiscar : 1;
  this.sheet.desenhar(this.x, this.y, this.direcao === HEROINA_ESQUERDA);
  ctx.restore();

  // debug da hitbox de ataque 
  ctx.save();
  ctx.lineWidth = 2;

  if (this.danoAtivo) {
    if (this.direcao === HEROINA_DIREITA) {
      const h = this.hitboxAtaqueDireita;
      ctx.strokeStyle = "red";
      ctx.strokeRect(h.x, h.y, h.largura, h.altura);
    } else {
      const h = this.hitboxAtaqueEsquerda;
      ctx.strokeStyle = "orange";
      ctx.strokeRect(h.x, h.y, h.largura, h.altura);
    }
  }

  ctx.restore();
},


}