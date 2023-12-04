import Game from "./Game.js";
import { Tile } from "./Map.js";

export default class Player{
    pos: {x:number,y:number} = {x:10,y:10}
    currentAction: {
        name: "moving" | "casting" | "targeting" | "waiting"
        targetingTiles: Tile[] | null
        targetPos: {x:number,y:number} | null
    }= {
        name: "targeting",
        targetingTiles: null,
        targetPos: null
    }


    update(game:Game){
        const {UP,DOWN,LEFT,RIGHT} = game.controls
        const {cols,rows} = game.map

        if(UP){
            this.pos.y - 1 >= 0 ? this.pos.y -= 1 : this.pos.y = 0
        }
        else if(DOWN){
            this.pos.y + 1 < rows-1 ? this.pos.y += 1 : this.pos.y = rows-1
        }
        else if(LEFT){
            this.pos.x - 1 >= 0 ? this.pos.x -= 1 : this.pos.x = 0
        }
        else if(RIGHT){
            this.pos.x + 1 < cols-1 ? this.pos.x += 1 : this.pos.x = cols-1
        }                
    }
}