import Game from "./classes/Game.js";

console.log('anda');

const game = new Game()
let counter = 0
let turn = true
setInterval(()=>{
    if(counter+16 > 200){
        counter = 0
        turn = true
    }else{
        counter += 16
    }
    game.update(turn)
    turn = false
},16)