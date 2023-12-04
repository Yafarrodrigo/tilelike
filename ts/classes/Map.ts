import Game from "./Game.js"

export class Tile{
    x: number
    y: number
    color: string
    constructor(x:number,y:number, color:string){
        this.x = x
        this.y = y
        this.color = color
    }
}

export default class Map {
    width: number
    height: number
    tileSize: number
    cols: number
    rows: number
    tiles: Tile[][]

    constructor(w:number, h:number, tileSize: number){
        this.width = w
        this.height = h
        this.tileSize = tileSize
        this.cols = Math.floor(w / tileSize)
        this.rows = Math.floor(h / tileSize)

        this.tiles = new Array(this.cols).fill("").map(()=> new Array(this.rows).fill(""))
        for(let x = 0; x < this.cols; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y] = new Tile(x,y,`rgb(${Math.floor(Math.random()*50)},${Math.floor(Math.random()*50)},${Math.floor(Math.random()*50)})`)
            } 
        } 
    }

    getTileAt(x:number,y:number){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) return null
        let tileX = Math.floor( x / this.tileSize)
        let tileY = Math.floor( y / this.tileSize)
        return this.tiles[tileX][tileY]
    }

    getTile(x:number,y:number){
        if(x < 0 || x >= this.cols || y < 0 || y >= this.rows) return null
        return this.tiles[x][y]
    }
}