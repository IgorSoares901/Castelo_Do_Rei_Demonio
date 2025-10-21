function Animacao(context) {
    this.context = context;
    this.sprites = [];
    this.ligado = false;
    this.camera = null;

     this.cam = { 
      x: 0, 
      y: 0,
      width: context.canvas.width,
      height: context.canvas.height,
      
      //tentar calcular as bordas da camera invisivel
      bordaEsquerda: function() { return this.x + this.width * 0.2; },
      bordaDireita: function() { return this.x + this.width * 0.35; },
      BordaCima: function() { return this.y + this.height * 0.1; },
      BordaBaixo: function() { return this.y + this.height * 0.3; }

    };

 }
 Animacao.prototype = {
    novoSprite: function(sprite) {
       this.sprites.push(sprite);
        //definindo o foco da câmera  
       if (this.camera === null) {
            this.camera = sprite;
         }
    },

    excluirSprite: function(sprite) {
      var indice = this.sprites.indexOf(sprite);
      if (indice !== -1) {
         this.sprites.splice(indice, 1);
      }

      
    }, // tive que adicionar toda essa function para o arqueiro não desaparecer junto com a flecha
    
    ligar: function() {
       this.ligado = true;
       this.proximoFrame();
       
    },
    desligar: function() {
       this.ligado = false;
    },

    inserirFundo: function(sprite,indice) {
       this.sprites.splice(indice,0,sprite);
    },

    proximoFrame: function() {
       // Posso continuar?
       if ( ! this.ligado ) return;

       // Atualizamos a câmera
       if(this.camera) {
          this.atualizarCamera();
       }
 
       // Atualizamos o estado dos sprites
       for (var i in this.sprites)
          this.sprites[i].atualizar();

        //camera aplicada
       var ctx = this.context;
       ctx.save();
       //vai usar a posição da câmera para transladar a tela
       ctx.translate(-this.cam.x, -this.cam.y);

       // A cada ciclo, limpamos a tela ou desenhamos um fundo
       this.limparTela();
 
       // Desenhamos os sprites
       for (var i in this.sprites)
          this.sprites[i].desenhar();

       ctx.restore();

       // processa colisão entre os sprites
       if (this.colisor) this.colisor.processar();
 
       // Chamamos o próximo ciclo
       var animacao = this;
       requestAnimationFrame(function() {
          animacao.proximoFrame();
       });
    },

    atualizarCamera: function() {
         var foco = this.camera;
         var cam = this.cam;
         var tamanhoMundo = { width: 3530, height: 640 }; //tamanho do mundo

         //foco da câmera é a heroina
         var heroinaX = 128;// largura da heroina
         var heroinaY = 128;// altura da heroina

         

         //atualizar posição da câmera Horizontal
         if (foco.x < cam.bordaEsquerda()) {
            cam.x = foco.x - cam.width * 0.3;
         }
         if (foco.x > cam.bordaDireita()) {
            cam.x = foco.x + heroinaX - cam.width * 0.75;
         }

         //atualizar posição da câmera Vertical
         if (foco.y < cam.BordaCima()) {
            cam.y = foco.y - cam.height * 0.1;
         }
         if (foco.y + heroinaY > cam.BordaBaixo()) { //ajustar para o pé da heroina
            cam.y = foco.y + heroinaY - cam.height * 0.85;
         }

         //impedir que a câmera saia dos limites do mundo
         if (cam.x < 0) {
            cam.x = 0; // camera n vai para a esquerda do mundo
         }else if (cam.x + cam.width > tamanhoMundo.width) {
            // camera n vai parar na direita do mundo
            cam.x = tamanhoMundo.width - cam.width;

            if (cam.x < 0) cam.x = 0;
             // caso a largura do mundo seja menor que a largura da câmera
         }

         //impedir que a câmera saia dos limites do mundo verticalmente
            if (cam.y < 0) {
               cam.y = 0;
            } else if (cam.y + cam.height > tamanhoMundo.height) {
               cam.y = tamanhoMundo.height - cam.height;
               if (cam.y < 0) cam.y = 0;
            }
            cam.x = Math.round(cam.x);
            cam.y = Math.round(cam.y);
    },

    limparTela: function() {
       var ctx = this.context;
       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
 }