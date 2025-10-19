function Spritesheet(context, imagem, linhas, colunas, framesPorLinha = []) {
    this.context = context;
    this.imagem = imagem;
    this.numLinhas = linhas;
    this.numColunas = colunas; // valor máximo padrão
    this.intervalo = 0;
    this.linha = 0;
    this.coluna = 0;
    this.framesPorLinha = framesPorLinha; // tive que criar esse construtor para definir corretamento o de todos os personagens
}

Spritesheet.prototype = {
    proximoQuadro: function(sentido = 1) {
        const agora = new Date().getTime(); // mudou de var para const

         // Se ainda não tem o último tempo medido
        if (!this.ultimoTempo) this.ultimoTempo = agora;

        // Já é hora de mudar de coluna?
        if (agora - this.ultimoTempo < this.intervalo) return;

        
        this.coluna += sentido; // parte que está avançando os quadros

        
        const totalColunas = this.framesPorLinha[this.linha] || this.numColunas; // precisou dessa constante para saber o número total de colunas por linhas

        // Correção de limites
        if (this.coluna >= totalColunas) this.coluna = 0;
        if (this.coluna < 0) this.coluna = totalColunas - 1;

        // Guardar a última mudança
        this.ultimoTempo = agora;
    },

    // tive que adicionar o espelhar para poder espelhar as animações
    desenhar: function(x, y, espelhar = false) {
        const largura = Math.floor(this.imagem.width / this.numColunas);
        const altura = Math.floor(this.imagem.height / this.numLinhas);
        const ctx = this.context;

        if (espelhar) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.imagem,
                largura * this.coluna,
                altura * this.linha,
                largura, altura,
                -x - largura, y, largura, altura
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                this.imagem,
                largura * this.coluna,
                altura * this.linha,
                largura, altura,
                x, y, largura, altura
            );
        }
    }
};
