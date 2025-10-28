
// -------------------------------------------------------------------------------//
// teste 2

// var Parallax = function(contexto) {
// this.ctx = contexto; // Contexto do canvas
// this.camadas = []; // Array de camadas de fundo
// this.offset = 0; // Deslocamento horizontal global
// };




// Parallax.prototype = {
// // Adiciona uma camada (imagem + velocidade)
// adicionarCamada: function(imagem, velocidadeParallax) {
// this.camadas.push({
// imagem: imagem,
// velocidade: velocidadeParallax,
// y: 0 // Posição vertical fixa (pode ser ajustada conforme necessário)

// });
// },

// // Atualiza o deslocamento (movimento automático)
// atualizar: function() {
//     // Aumente ou diminua esse valor para controlar a velocidade geral
//     this.offset += 0.005; 
// },

// // Desenha todas as camadas com loop contínuo
// desenhar: function() {
//     for (let i = 0; i < this.camadas.length; i++) {
//         let camada = this.camadas[i];
//         let img = camada.imagem;

//         // Ignora se a imagem ainda não foi carregada
//         if (!img || !img.complete) continue;

//         // Calcula a posição horizontal da imagem com base no deslocamento
//         let x = - (this.offset * camada.velocidade) % img.width;
//         let sobreposicao = 5; // Pequena sobreposição para evitar falhas visuais

//         // Desenha a primeira imagem
//         this.ctx.drawImage(img, x, camada.y);

//         // Desenha uma segunda imagem ao lado para criar o loop infinito
//         if (x < 0) {
//             this.ctx.drawImage(img, x + img.width, camada.y);
//         }
//     }
// }

// };


// var Parallax = function(contexto) {
// this.ctx = contexto;     // Contexto do canvas
// this.camadas = [];       // Camadas de imagens
// this.offset = 0;         // Deslocamento horizontal global
// };

// Parallax.prototype = {
//     // Adiciona uma camada (imagem + velocidade + posição Y opcional)
//     adicionarCamada: function(imagem, velocidadeParallax, posY = 0) {
//     this.camadas.push({
//     imagem: imagem,
//     velocidade: velocidadeParallax,
//     posY: posY // se mudar aqui a nuvem E o muro vão ficar mais alta ou mais baixa
//     });
//     },


//     // Atualiza deslocamento — controla a velocidade global
//     atualizar: function() {
//         this.offset += 0.003; // rapaz isso aqui deixa o muro rapido demais
//     },

//         // Desenha todas as camadas com repetição completa no mapa
//     desenhar: function() {
//         for (let i = 0; i < this.camadas.length; i++) {
//             let camada = this.camadas[i];
//             let img = camada.imagem;

//             if (!img || !img.complete) continue;

//             // Calcula a posição inicial da primeira imagem
//             let x = - (this.offset * camada.velocidade) % img.width;
//             let sobreposicao = 5; // aqui foi pq o muro tava dando umas falhas entre os loops

//             // Quantas repetições são necessárias para cobrir o mapa (5000px)
//             let numReps = Math.ceil(5000 / img.width) + 2;

//             // Desenha várias repetições da imagem para garantir cobertura
//             for (let n = -1; n < numReps; n++) {
//                 this.ctx.drawImage(img, x + (n * (img.width - sobreposicao)), camada.posY);
//             }
//         }
//     }


// };

var Parallax = function(contexto) {
this.ctx = contexto;
this.camadas = [];
this.offset = 0; // deslocamento global (anda sozinho)
};




Parallax.prototype = {
adicionarCamada: function(imagem, velocidade, posY = 0) {
this.camadas.push({
imagem: imagem,
velocidade: velocidade,
posY: posY
});
},

atualizar: function() {
    // faz o fundo se mover sozinho
    this.offset += 0.5; // ajuste geral de velocidade (aumente se quiser mais rápido)
},

desenhar: function() {
    const larguraMapa = 5000; // largura total do mundo
    const sobreposicao = 5;   // evita frestas entre imagens

    for (let camada of this.camadas) {
        const img = camada.imagem;
        if (!img || !img.complete) continue;

        // deslocamento horizontal baseado na velocidade da camada
        const deslocamento = (this.offset * camada.velocidade) % img.width;

        // desenha repetições da imagem para cobrir o mapa inteiro
        const repeticoes = Math.ceil(larguraMapa / img.width) + 2;
        for (let n = -1; n < repeticoes; n++) {
            this.ctx.drawImage(
                img,
                -deslocamento + (n * (img.width - sobreposicao)),
                camada.posY
            );
        }
    }
}
};