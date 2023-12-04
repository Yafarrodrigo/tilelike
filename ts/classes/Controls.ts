import Game from "./Game.js"
import _SKILLSHAPES from "../SkillShapes.js"

export default class Controls{

    UP: boolean
    DOWN: boolean
    LEFT: boolean
    RIGHT: boolean
    cursorAt: {
        x:number,
        y:number
    }
    cursorQuadrant:string // "+x+y" | "+x-y" | "-x-y" | "-x+y"
    cursorDir: "right" | "down" | "left" | "up"

    constructor(){

        this.UP = false
        this.DOWN = false
        this.LEFT = false
        this.RIGHT = false
        this.cursorAt = {x:0,y:0}
        this.cursorQuadrant = "+x+y"
        this.cursorDir = "right"

        window.addEventListener('keydown', (e:KeyboardEvent) => {
            if(e.code === 'ArrowLeft' || e.code === "KeyA"){
                this.LEFT = true;
            }
            if(e.code === 'ArrowUp' || e.code === "KeyW"){
                this.UP = true;
            }
            if(e.code === 'ArrowRight' || e.code === "KeyD"){
                this.RIGHT = true;
            }
            if(e.code === 'ArrowDown' || e.code === "KeyS"){
                this.DOWN = true;
            }
        });
        
        window.addEventListener('keyup', (e:KeyboardEvent) => {
            
            if(e.code === 'ArrowLeft' || e.code === "KeyA"){
                this.LEFT = false;
            }
            if(e.code === 'ArrowUp' || e.code === "KeyW"){
                this.UP = false;
            }
            if(e.code === 'ArrowRight' || e.code === "KeyD"){
                this.RIGHT = false;
            }
            if(e.code === 'ArrowDown' || e.code === "KeyS"){
                this.DOWN = false;
            }
        });
    }

    createListeners(game: Game){
        window.addEventListener('resize', () => {
            game.graphics.canvas.width = window.innerWidth
            game.graphics.canvas.height = window.innerHeight
        })

        game.graphics.canvas.addEventListener('mousemove', (e:MouseEvent) => {
            const {x,y} = this.getMousePos(game.graphics.canvas, e)
            const {tileSize} = game.graphics
            this.cursorAt = {x,y}
            let axisX, axisY
            const midX = (game.graphics.canvas.width/2)-(tileSize/2)
            const midY = (game.graphics.canvas.height/2)-(tileSize/2)
            x > midX ? axisX = "+x" : axisX = "-x"
            y > midY ? axisY = "-y" : axisY = "+y"
            this.cursorQuadrant = axisX+axisY
            
            const angleDeg = Math.atan2(midY+(tileSize/2) - y, midX+(tileSize/2) - x) * 180 / Math.PI;
            if(angleDeg >= -45 && angleDeg <= 45) this.cursorDir = "left"
            else if(angleDeg > 45 && angleDeg < 140) this.cursorDir = "up"
            else if(angleDeg > 140 && angleDeg <= 180 || angleDeg < -140) this.cursorDir = "right"
            else this.cursorDir = "down"
        }) 
        
        game.graphics.canvas.addEventListener('click', (e:MouseEvent) => {
            console.log(this.cursorAt);
            console.log(game.map.getTileAt(this.cursorAt.x,this.cursorAt.y));
            console.log(this.cursorQuadrant, this.cursorDir);
            console.log(game.player.currentAction.targetingTiles);
            
        }) 
        game.graphics.canvas.addEventListener('contextmenu', (e:MouseEvent) => {
            e.preventDefault()
            if(game.player.currentAction.name === "waiting"){
                game.player.currentAction.name = "targeting"
            }
            else{
                game.player.currentAction.name = "waiting"
            }
            
            //game.graphics.showSkillIndicator(game,_SKILLSHAPES.triangle)
        }) 
    }

    getMousePos(canvas: HTMLCanvasElement, evt:MouseEvent){
        const rect = canvas.getBoundingClientRect();

        const widthScale = canvas.width / rect.width;
        const heightScale = canvas.height / rect.height;

        let [x,y] = [Math.floor(((evt.clientX - rect.left) * widthScale)),
                        Math.floor(((evt.clientY - rect.top) * heightScale))]

        return{x,y}
    }
}