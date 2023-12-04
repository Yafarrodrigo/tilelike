import Controls from "./Controls.js";
import Graphics from "./Graphics.js";
import Map from "./Map.js";
import Player from "./Player.js";

export default class Game{
    map: Map = new Map(2000,2000,40)
    graphics: Graphics = new Graphics(window.innerWidth,window.innerHeight, 40)
    player:Player = new Player()
    controls: Controls = new Controls()

    constructor(){
        this.controls.createListeners(this)
    }

    update(turn:boolean){        
        this.graphics.update(this)

        if(turn){
            this.player.update(this)
        }
    }
}