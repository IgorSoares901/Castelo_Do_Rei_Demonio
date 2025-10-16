var HEROINA_DIREITA = 1;

var HEROINA_ESQUERDA = 2;

var HEROINA_PULANDO = 3;


function Sonic(context, teclado, imagem) { 

   this.context = context; 

   this.teclado = teclado; 

   this.animacao = animacao;

   this.x = 0; 

   this.y = 0; 

   this.velocidade = 4;



   // Criando a spritesheet a partir da imagem recebida

   this.sheet = new Spritesheet(context, imagem, 6,10);

   this.sheet.intervalo = 60;



   // Estado inicial

   this.andando = false;

   this.direcao = HEROINA_DIREITA;

} 

Sonic.prototype = {
    atualizar: function() {
        // ANDAR PARA DIREITA
        if (this.teclado.pressionada(SETA_DIREITA)) {
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

    