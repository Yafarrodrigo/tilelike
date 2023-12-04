import Game from "./Game.js"
import Player from "./Player.js"

export default class Viewport{
  w: number
  h: number
  screen: {x:number,y:number}
  startTile: {x:number,y:number}
  endTile: {x:number,y:number}
  offset: {x:number,y:number}
  viewTileSize: number
    constructor(w:number,h:number, tileSize:number){
        this.w = w
        this.h = h
        this.screen = {x:w,y:h}
        this.startTile = {x:0,y:0}
        this.endTile = {x:0,y:0}
        this.offset = {x:0,y:0}
        this.viewTileSize = tileSize
    }

    updateViewport(game: Game){

      const {x: targetX,y: targetY} = game.player.pos
          
        this.screen.x = this.w
        this.screen.y = this.h
    
        this.offset.x = Math.floor(((this.screen.x/2/this.viewTileSize) - targetX))
        this.offset.y = Math.floor(((this.screen.y/2/this.viewTileSize) - targetY))
    
        const tile = {
          x: targetX,
          y: targetY
        }
    
        this.startTile.x = tile.x - 1 - Math.ceil((this.screen.x/2) / this.viewTileSize)
        this.startTile.y = tile.y - 1 - Math.ceil((this.screen.y/2) / this.viewTileSize)  
    
        if(this.startTile.x < 0) this.startTile.x = 0
        if(this.startTile.y < 0) this.startTile.y = 0
    
        this.endTile.x = tile.x + 1 + Math.ceil((this.screen.x/2) / this.viewTileSize)
        this.endTile.y = tile.y + 1 + Math.ceil((this.screen.y/2) / this.viewTileSize)
    
        if(this.endTile.x >= game.map.rows) this.endTile.x = game.map.rows -1
        if(this.endTile.y >= game.map.cols) this.endTile.y = game.map.cols -1
      }
}