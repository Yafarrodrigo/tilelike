import Game from "./Game.js"
import Map, { Tile } from "./Map.js"
import Player from "./Player.js"
import Viewport from "./Viewport.js"
import _SKILLSHAPES from "../SkillShapes.js"

// circle min radius = 4
type skillInfo = {
  shape: "rectangle" | "circle" | "custom"
  width: number
  height: number
  range: number
  radius: number
  origin: "cursor" | "player"
  customData: {
    tiles: number[][]
    anchor: {x:number,y:number}
  }
}

export default class Graphics{
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    tileSize: number
    viewport: Viewport

    constructor(w:number,h:number,tileSize: number){
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'gameCanvas'
        this.canvas.width = w
        this.canvas.height = h
        document.body.append(this.canvas)
        this.ctx = this.canvas.getContext('2d')!

        this.ctx.fillStyle = "#333"
        this.ctx.fillRect(0,0,w,h)

        this.tileSize = tileSize
        this.viewport = new Viewport(w,h, tileSize)
    }

    drawViewport(map: Map){

      const tileSize =  this.viewport.viewTileSize
      const {offset} = this.viewport
      
      for(let x = this.viewport.startTile.x; x <= this.viewport.endTile.x; x++){
        for(let y = this.viewport.startTile.y; y <= this.viewport.endTile.y; y++){
  
          const tile = map.tiles[x][y]
  
          const finalX = ((tile.x+offset.x) * tileSize)
          const finalY = ((tile.y+offset.y) * tileSize)
  
          this.ctx.fillStyle = tile.color
          this.ctx.strokeStyle = "#333"
          this.ctx.fillRect(finalX, finalY, map.tileSize, map.tileSize)
          this.ctx.strokeRect(finalX, finalY, map.tileSize, map.tileSize)
        }
      }
    }

    checkTileInViewport(map:Map, tileX:number,tileY:number){
      const {offset} = this.viewport

      for(let x = this.viewport.startTile.x; x <= this.viewport.endTile.x; x++){
        for(let y = this.viewport.startTile.y; y <= this.viewport.endTile.y; y++){
          const tile = map.tiles[x][y]
          if(tile.x-offset.x === tileX && tile.y-offset.y === tileY) return true
        }
      }
      return false
    }

    showHoveredTile(game:Game){
      this.ctx.fillStyle = "rgba(100,100,255,0.25)"
      this.ctx.fillRect(Math.floor(game.controls.cursorAt.x/this.tileSize)*this.tileSize, Math.floor(game.controls.cursorAt.y/this.tileSize)*this.tileSize, this.tileSize, this.tileSize)
    }

    // Manhattan Distance
    distance(x1:number,y1:number,x2:number,y2:number){
      return Math.abs(Math.abs(x1-x2) + Math.abs(y1-y2))
    }

    rotate2dArr(arr:number[][], anchor:{x:number,y:number}, dir: "up" | "left" | "down" | "right"){
      const oldX = anchor.x
      const oldY = anchor.y
      let newAnchor = anchor
      
      if(dir === "down"){
        newAnchor = {x: oldY, y: oldX}
        return {tiles:arr[0].map((val, index) => arr.map(row => row[row.length-1-index])),anchor:newAnchor}
      }
      else if(dir === "left"){        const firstTurn = arr[0].map((val, index) => arr.map(row => row[row.length-1-index]));
        newAnchor = {x:arr.length-1-oldX,y:oldY}
        return {tiles:firstTurn[0].map((val, index) => firstTurn.map(row => row[row.length-1-index])),anchor:newAnchor}
      }
      else if(dir === "up"){
        newAnchor = {x:oldY,y:arr.length-1-oldX}
        return {tiles:arr[0].map((val, index) => arr.map(row => row[index]).reverse()),anchor:newAnchor}
      }
      else return {tiles:arr,anchor:newAnchor}
    }

    showSkillIndicator(game:Game, skill:skillInfo){
      const {cursorAt} = game.controls
      const {cols,rows} = game.map
      const {offset} = this.viewport
      let hoveredTile = game.map.getTileAt(cursorAt.x,cursorAt.y)
      if(!hoveredTile) return
      
      const affectedTiles:Tile[] = []
      
      const playerTile = game.map.getTile(game.player.pos.x+offset.x,game.player.pos.y+offset.y)!
      if(skill.origin === "player"){
        hoveredTile = playerTile
      }else{
        if(skill.range > 0){
          // SHOW AVAILABLE TILES 
          let availableTiles = []
          for(let x = -skill.range; x <= skill.range; x ++){
            for(let y = -skill.range; y <= skill.range; y++){
              if(playerTile.x+x < 0 || playerTile.x+x >= cols || playerTile.y+y < 0 || playerTile.y+y >= rows) continue
              if((x*x)+(y*y) >= (skill.range*skill.range)) continue
              const tileToPaint = game.map.getTile(playerTile.x+x, playerTile.y+y)
              if(!tileToPaint) continue
              const realTile = game.map.getTile(tileToPaint.x-offset.x,tileToPaint.y-offset.y)
              if(!realTile) continue
              if(tileToPaint){
                availableTiles.push(tileToPaint)
                this.drawTile(tileToPaint.x,tileToPaint.y,"rgba(200,200,255,0.25)")
              } else continue
            }
          }
          this.drawTile(hoveredTile.x,hoveredTile.y, "yellow")
          for(let i = 0; i < availableTiles.length; i++){
            if(!availableTiles.find( tile => tile.x === hoveredTile!.x && tile.y === hoveredTile!.y)){
              if(game.player.currentAction.name === "targeting"){
                game.player.currentAction.targetingTiles = []
              }
              return
            }
          }
        }
      }

      if(skill.shape === "custom"){
        const {customData} = skill
        const {tiles,anchor} = this.rotate2dArr(customData.tiles,customData.anchor,game.controls.cursorDir)
        let startIndexX = -anchor.x
        let endIndexX = tiles.length-1 - anchor.x
        let startIndexY = -anchor.y
        let endIndexY = tiles[0].length-1 - anchor.y
        
        for(let x = startIndexX; x <= endIndexX; x++){
          for(let y = startIndexY; y <= endIndexY; y++){
            if(hoveredTile.x+x < 0 || hoveredTile.x+x >= cols || hoveredTile.y+y < 0 || hoveredTile.y+y >= rows) continue
            if(tiles[x+anchor.x][y+anchor.y] === 0) continue
            const tileToPaint = game.map.getTile(hoveredTile.x+x, hoveredTile.y+y)
            if(!tileToPaint) continue
            const realTile = game.map.getTile(tileToPaint.x-offset.x,tileToPaint.y-offset.y)
            if(!realTile) continue
            affectedTiles.push(realTile)
            this.drawTile(tileToPaint.x,tileToPaint.y,"rgba(100,100,255,0.35)")
          }
        }
      }
      else if(skill.shape === "rectangle"){
        let startIndexX = Math.floor(skill.width/2)
        let endIndexX = Math.ceil(skill.width/2)
        let startIndexY = Math.floor(skill.height/2)
        let endIndexY = Math.ceil(skill.height/2)
        for(let x = 0-startIndexX; x < endIndexX; x ++){
          for(let y = 0-startIndexY; y < endIndexY; y++){
            if(hoveredTile.x+x < 0 || hoveredTile.x+x >= cols || hoveredTile.y+y < 0 || hoveredTile.y+y >= rows) continue
            const tileToPaint = game.map.getTile(hoveredTile.x+x, hoveredTile.y+y)
            if(!tileToPaint) continue
            const realTile = game.map.getTile(tileToPaint.x-offset.x,tileToPaint.y-offset.y)
            if(!realTile) continue
            affectedTiles.push(realTile)
            this.drawTile(tileToPaint.x,tileToPaint.y,"rgba(100,100,255,0.35)")
          }
        }
      }
      else if(skill.shape === "circle"){
        
        for(let x = -skill.radius; x <= skill.radius; x ++){
          for(let y = -skill.radius; y <= skill.radius; y++){
            if(hoveredTile.x+x < 0 || hoveredTile.x+x >= cols || hoveredTile.y+y < 0 || hoveredTile.y+y >= rows) continue
            if((x*x)+(y*y) >= (skill.radius*skill.radius)) continue
            const tileToPaint = game.map.getTile(hoveredTile.x+x, hoveredTile.y+y)
            if(!tileToPaint) continue
            const realTile = game.map.getTile(tileToPaint.x-offset.x,tileToPaint.y-offset.y)
            if(!realTile) continue
            affectedTiles.push(realTile)
            if(tileToPaint){

              this.drawTile(tileToPaint.x,tileToPaint.y,"rgba(100,100,255,0.35)")
            } else continue
          }
        }
      }
      
      if(game.player.currentAction.name === "targeting"){
        game.player.currentAction.targetingTiles = affectedTiles
      }
    }

    drawTile(x:number,y:number, color:string){
      this.ctx.fillStyle = color
      this.ctx.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize)
    }

    drawPlayer(player: Player){
        const {offset} = this.viewport
        this.ctx.fillStyle = "red"
        this.ctx.fillRect((player.pos.x +offset.x)*this.tileSize, (player.pos.y +offset.y)*this.tileSize, this.tileSize, this.tileSize)
    }

    update(game: Game){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.viewport.updateViewport(game)
        this.drawViewport(game.map)
        
        if(game.player.currentAction.name === "targeting"){
          this.showSkillIndicator(game, {
            shape: "circle",
            radius: 5,
            height: 0,
            width: 0,
            range: 8,
            origin: "cursor",
            customData: _SKILLSHAPES.triangle
          }) 
        }

        this.drawPlayer(game.player)
    }
}