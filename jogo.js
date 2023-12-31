console.log('Flappy Bird');

let frames = 0;


const som_CAIU = new Audio();
som_CAIU.src = './efeitos/efeitos_caiu.wav';
const som_HIT = new Audio();
som_HIT.src = './efeitos/efeitos_hit.wav';
const som_PULO = new Audio();
som_PULO.src = './efeitos/efeitos_pulo.wav';
const som_PONTO = new Audio();
som_PONTO.src = './efeitos/efeitos_ponto.wav';
const frame4 = new Image();
frame4.src = './frame4.png';
const Boom = new Image();
Boom.src = './Boom.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const explosao = {
    largura: 50,
    altura: 50,
    x: 0,
    y: 0,
    desenha() {
        contexto.drawImage(
            Boom,
            explosao.x, explosao.y,
            explosao.largura, explosao.altura
        );
    }
};
// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height -204,
    desenha(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            frame4,
            planoDeFundo.spriteX,planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura,planoDeFundo.altura, //tamanho do recorte na sprite
            planoDeFundo.x,planoDeFundo.y, // localização dentro do jogo 
            planoDeFundo.largura,planoDeFundo.altura, // tamanho dentro do jogo
        );
        contexto.drawImage(
            frame4,
            planoDeFundo.spriteX,planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura,planoDeFundo.altura, //tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura),planoDeFundo.y, // localização dentro do jogo 
            planoDeFundo.largura,planoDeFundo.altura, // tamanho dentro do jogo
        );
    }
}
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height -112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage(
                frame4,
                chao.spriteX,chao.spriteY, // sprite x e sprite y
                chao.largura,chao.altura, //tamanho do recorte na sprite
                chao.x,chao.y, // localização dentro do jogo 
                chao.largura,chao.altura, // tamanho dentro do jogo
            );
            contexto.drawImage(
                frame4,
                chao.spriteX,chao.spriteY, // sprite x e sprite y
                chao.largura,chao.altura, //tamanho do recorte na sprite
                (chao.x + chao.largura),chao.y, // localização dentro do jogo 
                chao.largura,chao.altura, // tamanho dentro do jogo
            );
        },
    };
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if(flappyBirdY >= chaoY){
        return true;
    }
    return false;
}

function criaMedalha(){
    const medalha = {
        spriteX: 0,
        spriteY: 78,
        largura: 44,
        altura: 44,
        x: 73,
        y: 135,
        atualiza() {
            if (globais.placar.pontuacao >= 60) {
                medalha.spriteX = 0;
                medalha.spriteY = 124;
            } else if (globais.placar.pontuacao >= 40) {
                medalha.spriteX = 48;
                medalha.spriteY = 124;
            } else if (globais.placar.pontuacao >= 20) {
                medalha.spriteX = 48;
                medalha.spriteY = 78;
            } else if (globais.placar.pontuacao >= 5) {
                medalha.spriteX = 0;
                medalha.spriteY = 78;
            }
        },
        desenha(){
            contexto.drawImage(
                frame4,
                medalha.spriteX,medalha.spriteY, // sprite x e sprite y
                medalha.largura,medalha.altura, //tamanho do recorte na sprite
                medalha.x,medalha.y, // localização dentro do jogo 
                medalha.largura,medalha.altura, // tamanho dentro do jogo
            );
        }
    }
    return medalha;
}
const botaoStart = {
    spriteX: 206,
    spriteY: 325,
    largura: 82,
    altura: 28,
    x: 119,
    y: 222,
    desenha(){
        contexto.drawImage(
            frame4,
            botaoStart.spriteX,botaoStart.spriteY, // sprite x e sprite y
            botaoStart.largura,botaoStart.altura, //tamanho do recorte na sprite
            botaoStart.x,botaoStart.y, // localização dentro do jogo 
            botaoStart.largura,botaoStart.altura, // tamanho dentro do jogo
        );
    },
}

function criaFlappyBird(spriteX, spriteY, movimentos) {
    const flappyBird = {
        spriteX,
        spriteY,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula(){
            flappyBird.velocidade = - flappyBird.pulo;
            som_PULO.play();
        },
        velocidade: 0,
        gravidade: 0.25,
        atualiza(){
            if(fazColisao(flappyBird, globais.chao)){
                som_CAIU.play();
                mudaParaTela(telas.GAME_OVER);
                return;
            }
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        },
        movimentos,
        frameAtual: 0,
        atualizaOFrameAtual(){
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            if (passouOIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao; 
            }
            
        },
        desenha(){
            flappyBird.atualizaOFrameAtual()
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                frame4,
                spriteX,spriteY, // sprite x e sprite y
                flappyBird.largura,flappyBird.altura, //tamanho do recorte na sprite
                flappyBird.x,flappyBird.y, // localização dentro do jogo 
                flappyBird.largura,flappyBird.altura, // tamanho dentro do jogo
            );
        }
    }
    return flappyBird;
}
const movimentosFlappy1 = [
        { spriteX: 0, spriteY: 0, }, // asa pra cima
        { spriteX: 0, spriteY: 26, }, // asa no meio
        { spriteX: 0, spriteY: 52, }, // asa pra baixo
        { spriteX: 0, spriteY: 26, }, // asa no meio
]
const movimentosFlappy2 = [
    { spriteX: 37, spriteY: 0, }, // asa pra cima
    { spriteX: 37, spriteY: 26, }, // asa no meio
    { spriteX: 37, spriteY: 52, }, // asa pra baixo
    { spriteX: 37, spriteY: 26, }, // asa no meio
]
const flappyBirdTelainicial = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 100,
    y: 220,
    desenha(){
        contexto.drawImage(
            frame4,
            flappyBirdTelainicial.spriteX,flappyBirdTelainicial.spriteY, // sprite x e sprite y
            flappyBirdTelainicial.largura,flappyBirdTelainicial.altura, //tamanho do recorte na sprite
            flappyBirdTelainicial.x,flappyBirdTelainicial.y, // localização dentro do jogo 
            flappyBirdTelainicial.largura,flappyBirdTelainicial.altura, // tamanho dentro do jogo
        );
    },
}
const flappyBirdTelainicial2 = {
    spriteX: 37,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 185,
    y: 220,
    desenha(){
        contexto.drawImage(
            frame4,
            flappyBirdTelainicial2.spriteX,flappyBirdTelainicial2.spriteY, // sprite x e sprite y
            flappyBirdTelainicial2.largura,flappyBirdTelainicial2.altura, //tamanho do recorte na sprite
            flappyBirdTelainicial2.x,flappyBirdTelainicial2.y, // localização dentro do jogo 
            flappyBirdTelainicial2.largura,flappyBirdTelainicial2.altura, // tamanho dentro do jogo
        );
    },
}
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width /2) - 174 / 2,
    y: 50,
    desenha(){
        contexto.drawImage(
            frame4,
            mensagemGetReady.sX,mensagemGetReady.sY, // sprite x e sprite y
            mensagemGetReady.w,mensagemGetReady.h, //tamanho do recorte na sprite
            mensagemGetReady.x,mensagemGetReady.y, // localização dentro do jogo 
            mensagemGetReady.w,mensagemGetReady.h, // tamanho dentro do jogo
        );
    }

}
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width /2) - 226 / 2,
    y: 50,
    desenha(){
        contexto.drawImage(
            frame4,
            mensagemGameOver.sX,mensagemGameOver.sY, // sprite x e sprite y
            mensagemGameOver.w,mensagemGameOver.h, //tamanho do recorte na sprite
            mensagemGameOver.x,mensagemGameOver.y, // localização dentro do jogo 
            mensagemGameOver.w,mensagemGameOver.h, // tamanho dentro do jogo
        );
    },
}
const tap = {
    sX: 162,
    sY: 118,
    w: 43,
    h: 18,
    x: 50,
    y: 220,
    desenha(){
        contexto.drawImage(
            frame4,
            tap.sX,tap.sY, // sprite x e sprite y
            tap.w,tap.h, //tamanho do recorte na sprite
            tap.x,tap.y, // localização dentro do jogo 
            tap.w,tap.h, // tamanho dentro do jogo
        );
    },
}
const tap2 = {
    sX: 237,
    sY: 118,
    w: 42,
    h: 18,
    x: 223,
    y: 220,
    desenha(){
        contexto.drawImage(
            frame4,
            tap2.sX,tap2.sY, // sprite x e sprite y
            tap2.w,tap2.h, //tamanho do recorte na sprite
            tap2.x,tap2.y, // localização dentro do jogo 
            tap2.w,tap2.h, // tamanho dentro do jogo
        );
    },
}
function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 120,
        desenha(){
            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacamentoInicial = canos.espaco;
                const espacamentoEntreCanos =
                    espacamentoInicial - calcularAjusteDeEspacamento(globais.placar.pontuacao);
                const espacamentoFinal = Math.max(60, espacamentoEntreCanos);
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
            
                // [Cano do Céu]
                contexto.drawImage(
                    frame4,
                    canos.ceu.spriteX,canos.ceu.spriteY, // sprite x e sprite y
                    canos.largura,canos.altura, //tamanho do recorte na sprite
                    canoCeuX,canoCeuY, // localização dentro do jogo 
                    canos.largura,canos.altura, // tamanho dentro do jogo
                )
                // [Cano do Chao]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    frame4,
                    canos.chao.spriteX,canos.chao.spriteY, // sprite x e sprite y
                    canos.largura,canos.altura, //tamanho do recorte na sprite
                    canoChaoX,canoChaoY, // localização dentro do jogo 
                    canos.largura,canos.altura, // tamanho dentro do jogo
                )
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            });
        },
        temColisaoComOFlappyBird(par){
            const cabecaDoFlappy = globais.personagemAtivo.y;
            const peDoFlappy = globais.personagemAtivo.y + globais.personagemAtivo.altura;
            if((globais.personagemAtivo.x + globais.personagemAtivo.largura) >= par.x){
               
                if(cabecaDoFlappy <= par.canoCeu.y){
                    return true;
                }
                if(peDoFlappy >= par.canoChao.y){
                    return true;
                }
                
            } 
            return false;
        },
        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random()+1),
                });
            }
            canos.pares.forEach(function(par){
                par.x = par.x - 2;

                if(canos.temColisaoComOFlappyBird(par)){
                    console.log('Você perdeu!');
                    som_HIT.play();
                    mudaParaTela(telas.GAME_OVER);

                    explosao.x = globais.personagemAtivo.x;
                    explosao.y = globais.personagemAtivo.y;

                    explosao.desenha();
                } 

                if(par.x + canos.largura <=0){
                    canos.pares.shift();
                }
            });
        }   
    }
    return canos;
};

function calcularAjusteDeEspacamento(pontuacao) {
    if (pontuacao >= 60) {
        return 20;  
    } else if (pontuacao >= 40) {
        return 10; 
    } else {
        return 0;  
    }
};

const pontuacaoMaxima = {
    maior: 0,
};

function criaPlacar(){
    const placar = {
    pontuacao: 0,
        desenha(){
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza(){
            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            if(passouOIntervalo){
                placar.pontuacao = placar.pontuacao + 1;
                if (placar.pontuacao >= 5){
                    som_PONTO.play();
                }
                if (placar.pontuacao >= 10){
                    som_PONTO.play();
                }
                if (placar.pontuacao >= 15){
                    som_PONTO.play();
                }
                if (placar.pontuacao >= 20){
                    som_PONTO.play();
                }
                if (placar.pontuacao > pontuacaoMaxima.maior) {
                    pontuacaoMaxima.maior = placar.pontuacao;
                }
            }
        },
        desenhaGameOver(){
            contexto.font = '30px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'brown';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 80, 145);
        },

        desenhaBest(){
            contexto.font = '30px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'brown';
            contexto.fillText(`${pontuacaoMaxima.maior}`, canvas.width - 80, 187);
        }
    }
    return placar;
}

/* [Telas] */
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela){
  telaAtiva = novaTela;
  if(telaAtiva.inicializa){
      telaAtiva.inicializa();
  }
}   

const telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird1 = criaFlappyBird(0, 0, movimentosFlappy1);
            globais.flappyBird2 = criaFlappyBird(37, 0, movimentosFlappy2);
            globais.chao = criaChao();
            globais.canos = criaCanos();
            globais.personagemAtivo = globais.flappyBird1;
        },
        desenha(){
            planoDeFundo.desenha();
            globais.personagemAtivo.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
            tap.desenha();
            tap2.desenha();
            flappyBirdTelainicial.desenha();
            flappyBirdTelainicial2.desenha();
        },
        click(event) {
            const clickX = event.x;
            const clickY = event.y;
    
            // Verifica se o clique foi no primeiro Flappy Bird
            if (
                (clickX >= flappyBirdTelainicial.x && clickX <= flappyBirdTelainicial.x + flappyBirdTelainicial.largura &&
                clickY >= flappyBirdTelainicial.y && clickY <= flappyBirdTelainicial.y + flappyBirdTelainicial.altura)
            ) {
                globais.personagemAtivo = globais.flappyBird1;
                mudaParaTela(telas.JOGO);
            }
            // Verifica se o clique foi no segundo Flappy Bird
            if (
                (clickX >= flappyBirdTelainicial2.x && clickX <= flappyBirdTelainicial2.x + flappyBirdTelainicial2.largura &&
                clickY >= flappyBirdTelainicial2.y && clickY <= flappyBirdTelainicial2.y + flappyBirdTelainicial2.altura)
            ) {
                globais.personagemAtivo = globais.flappyBird2;
                mudaParaTela(telas.JOGO);
            }
        },
        atualiza(){
            globais.chao.atualiza();
        }
        
    }
};
telas.JOGO = {
    inicializa(){
        globais.placar = criaPlacar();
    },
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.personagemAtivo.desenha();
        globais.placar.desenha();
    },
    click(){
        globais.personagemAtivo.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.personagemAtivo.atualiza();
        globais.chao.atualiza();
        globais.placar.atualiza();
    }
}
telas.GAME_OVER = {
    inicializa(){
        globais.medalha = criaMedalha();
    },
    desenha(){
        mensagemGameOver.desenha();
        botaoStart.desenha();
        globais.placar.desenhaGameOver();
        globais.placar.desenhaBest();
        globais.medalha.desenha();
    },
    atualiza(){
        globais.medalha.atualiza();
    },
    click(event){
        const clickX = event.x;
        const clickY = event.y;

        if (
            (clickX >= botaoStart.x && clickX <= botaoStart.x + botaoStart.largura &&
            clickY >= botaoStart.y && clickY <= botaoStart.y + botaoStart.altura)
        ) {
            mudaParaTela(telas.INICIO);
        }
    }
}
function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(event){
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    if(telaAtiva.click){
        telaAtiva.click({ x: clickX, y: clickY });
    }
});

mudaParaTela(telas.INICIO);
loop();