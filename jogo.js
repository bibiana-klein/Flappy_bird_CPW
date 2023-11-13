console.log('Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/efeitos_hit.wav';
const som_PULO = new Audio();
som_PULO.src = './efeitos/efeitos_pulo.wav';
const som_PONTO = new Audio();
som_PONTO.src = './efeitos/efeitos_ponto.wav';
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

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
            sprites,
            planoDeFundo.spriteX,planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura,planoDeFundo.altura, //tamanho do recorte na sprite
            planoDeFundo.x,planoDeFundo.y, // localização dentro do jogo 
            planoDeFundo.largura,planoDeFundo.altura, // tamanho dentro do jogo
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX,planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura,planoDeFundo.altura, //tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura),planoDeFundo.y, // localização dentro do jogo 
            planoDeFundo.largura,planoDeFundo.altura, // tamanho dentro do jogo
        );
    },
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
                sprites,
                chao.spriteX,chao.spriteY, // sprite x e sprite y
                chao.largura,chao.altura, //tamanho do recorte na sprite
                chao.x,chao.y, // localização dentro do jogo 
                chao.largura,chao.altura, // tamanho dentro do jogo
            );
            contexto.drawImage(
                sprites,
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
function criaFlappyBird(){
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
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
                som_HIT.play();
                mudaParaTela(telas.GAME_OVER);
                return;
            }
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio
        ],
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
                sprites,
                spriteX,spriteY, // sprite x e sprite y
                flappyBird.largura,flappyBird.altura, //tamanho do recorte na sprite
                flappyBird.x,flappyBird.y, // localização dentro do jogo 
                flappyBird.largura,flappyBird.altura, // tamanho dentro do jogo
            );
        }
    }
    return flappyBird;
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
            sprites,
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
            sprites,
            mensagemGameOver.sX,mensagemGameOver.sY, // sprite x e sprite y
            mensagemGameOver.w,mensagemGameOver.h, //tamanho do recorte na sprite
            mensagemGameOver.x,mensagemGameOver.y, // localização dentro do jogo 
            mensagemGameOver.w,mensagemGameOver.h, // tamanho dentro do jogo
        );
    }

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
        espaco: 80,
        desenha(){
            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
            
                // [Cano do Céu]
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX,canos.ceu.spriteY, // sprite x e sprite y
                    canos.largura,canos.altura, //tamanho do recorte na sprite
                    canoCeuX,canoCeuY, // localização dentro do jogo 
                    canos.largura,canos.altura, // tamanho dentro do jogo
                )
                // [Cano do Chao]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
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
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x){
               
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
                } 

                if(par.x + canos.largura <=0){
                    canos.pares.shift();
                }
            });
        }   
    }
    return canos;
}
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
            }
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
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(telas.JOGO);
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
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
        globais.placar.atualiza();
    }
}
telas.GAME_OVER = {
    desenha(){
        mensagemGameOver.desenha();
    },
    atualiza(){

    },
    click(){
        mudaParaTela(telas.INICIO);
    }
}
function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});


mudaParaTela(telas.INICIO);
loop();