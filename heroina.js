var HEROINA_DIREITA = 1;

var HEROINA_ESQUERDA = 2;

var HEROINA_PULANDO = 3;

var HEROINA_PULANDO_DIREITA = 4;

var HEROINA_PULANDO_ESQUERDA = 5;

var HEROINA_ATAQUE = 6;


function Sonic(context, teclado, imagem) { 

   this.context = context; 

   this.teclado = teclado; 

   this.animacao = animacao;

   this.x = 0; 

   this.y = 0; 

   this.velocidade = 4;

   this.atacando = false;

   this.frameAtaque = 0;



   // Criando a spritesheet a partir da imagem recebida

   this.sheet = new Spritesheet(context, imagem, 6,10);

   this.sheet.intervalo = 120; // velocidade da animação



   // Estado inicial

   this.andando = false;

   this.direcao = HEROINA_DIREITA;

} 

Sonic.prototype = {
    atualizar: function() {
    // o pulo teve que vir primeiro senão bugava tudo
if (this.teclado.pressionada(SETA_CIMA) && !this.pulando) {

    this.pulando = true;

    this.velocidadeY = -10; // isso aqui é a força inicial do pulo

    this.yInicial = this.y;  // ta gravando onde fica o chão

    this.alturaMaxima = this.yInicial - 75; // altura máxima que eu coloquei para o pulo

    this.sheet.linha = 0;  

    this.sheet.coluna = 0; // linha e coluna da animação de pulo
}

// Física para ela pular com gravidade
if (this.pulando) {
    this.y += this.velocidadeY;
    this.velocidadeY += 0.5; // gravidade quanto maior mais rapido ela vai cair

    if(this.teclado.pressionada(SETA_DIREITA)) {
        this.x += this.velocidade * 0.9; // fica mais lenta no ar
        this.direcao = HEROINA_DIREITA;
        this.estado = HEROINA_PULANDO_DIREITA;
    }

    else if(this.teclado.pressionada(SETA_ESQUERDA)) {
        this.x -= this.velocidade * 0.9;
        this.direcao = HEROINA_ESQUERDA;
        this.estado = HEROINA_PULANDO_ESQUERDA;
    }

    // Sobe usando os frames 0 ate o 5
    if (this.velocidadeY < 0) {
        const progresso = (this.yInicial - this.y) / 75;
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
            if (++this.frameAtaque % 3 === 0) {
                this.sheet.coluna++;
            } // Esse % serve tanto para controlar a velocidade do ataque e quanto maior for o número mais lenta ela vai ser

            // final dos quadros de ataque
            if (this.sheet.coluna > 6) {
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

    desenhar: function() {
        // Espelha automaticamente se estiver olhando pra esquerda
        this.sheet.desenhar(this.x, this.y, this.direcao === HEROINA_ESQUERDA);
    }
};

    