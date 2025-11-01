// arqiovo parralax js

var Parallax = function(contexto) {
    this.ctx = contexto;
    this.camadas = [];
    this.offset = 0; // deslocamento global (anda sozinho)
    };




Parallax.prototype = {
adicionarCamada: function(imagem, velocidade, posY = 0,posX = 0,ImgAltura=0,ImgLargura=0) {
        this.camadas.push({
        imagem: imagem,
        velocidade: velocidade,
        posY: posY,
        posX: posX,
        ImgAltura: ImgAltura,
        ImgLargura: ImgLargura
        });
        },

atualizar: function() {
            // faz o fundo se mover sozinho
            this.offset += 0.5; // ajuste geral de velocidade (aumente se quiser mais rápido)
        },

desenhar: function() {
        const larguraMapa = 6000; // largura total do mundo
        const sobreposicao = 5;   // evita frestas entre imagens

        for (let camada of this.camadas) {
            const img = camada.imagem;
            if (!img || !img.complete) continue;

            //aqui é para ajustar o tamanho da imagem se necessário
            var ImgWidth = camada.ImgLargura || img.width;
            var ImgHeight = camada.ImgAltura || img.height;

            // deslocamento horizontal baseado na velocidade da camada
            const deslocamentoX = (this.offset * camada.velocidade) % img.width;

            // mecher deslocamento vertical se necessário
            const deslocamentoY = (this.offset * camada.velocidade) % img.height;

            // desenha repetições da imagem para cobrir o mapa inteiro
            const repeticoes = Math.ceil(larguraMapa / img.width) + 2;

            for (let i = -1; i < repeticoes; i++) {
                this.ctx.drawImage(
                    img,
                    camada.posX-deslocamentoX + (i * (ImgWidth - sobreposicao)),
                    camada.posY,
                    ImgWidth,
                    ImgHeight
                );
            }
        }
    }
};