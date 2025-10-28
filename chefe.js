function Chefe(context, imagem, animacao, camera) {
  this.context = context;
  this.animacao = animacao;
  this.camera = camera;

  this.x = 400;
  this.y = 172;

  this.sheet = new Spritesheet(context, imagem, 3, 13, [13, 8, 3], 1.8);
  this.sheet.intervalo = 120;

  this.estado = "idle";
  this.direcao = "esquerda";
  this.velocidadeY = 0;
  this.noChao = true;
  this.alturaPulo = 160;
  this.velocidadeX = 5.0; // pra ele ir pro lado quando pular 
  this.yInicial = this.y;
  this.cooldownAtaque = Date.now() + 2000; // é o tempo que teremos para atacar ele

}

Chefe.prototype = {
  atualizar: function () {
    const agora = Date.now();

    // só atualiza se estiver visível na câmera
    const margem = 100;
    const visivel =
      this.x + 100 > this.camera.x - margem &&
      this.x < this.camera.x + this.camera.largura + margem;

    if (!visivel) return;

     // pulo ou ataque qualquer nome serve
    if (this.estado === "pulando") {
        this.y += this.velocidadeY;
        this.velocidadeY += 0.3; // gravidade
    
    // animacao dele subindo e descendo
    if (this.estado === "pulando") {
        const progresso = (this.yInicial - this.y) / this.alturaPulo;
        this.sheet.coluna = Math.min(6, Math.floor(progresso * 7)); // levanta do 0 ao 6 
    } else {
        const progresso = (this.y - (this.yInicial - this.alturaPulo)) / this.alturaPulo;
        this.sheet.coluna = 7 + Math.min(5, Math.floor(progresso * 6)) // 7 ao 12
    }

    //movimento lateral para a esquerda por enquanto
    this.x += (this.direcao === "esquerda" ? - this.velocidadeX : this.velocidadeX);

    // toca no chão
    if( this.y >= this.yInicial) {
        this.y = this.yInicial;
        this.velocidadeY = 0;
        this.noChao = true;
        this.estado = "idle";
        this.cooldownAtaque = agora + 2000;
    }

    return
}

    // ele parado
    if (this.estado === "idle") {
      this.sheet.linha = 1; 
      this.sheet.proximoQuadro();

      // 1 segundo parado antes de pular
      if (agora >= this.cooldownAtaque) {
        this.iniciarPulo();
      }
    }
  },

  iniciarPulo: function () {
    if (!this.noChao) return;
    this.noChao = false;
    this.estado = "pulando";
    this.sheet.linha = 0;
    this.sheet.coluna = 0;
    this.velocidadeY = -6;
    this.yInicial = this.y;
  },

  desenhar: function () {
    this.sheet.desenhar(this.x, this.y, this.direcao === "esquerda");
  },
};