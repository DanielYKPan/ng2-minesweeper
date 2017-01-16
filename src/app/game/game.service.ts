/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { STORE_TILES, REVEAL_TILE, UNCOVER_TILE, COVER_TILE, HIT_MINE, HIT_BLANK_TILE } from "./actions.const";
import { Tile } from "./tile";
import { GameLevelService } from "./game-level.service";

const TraversalPaths = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1}
];

export interface IGameStatus {
    gameStart?: boolean;
    gameOver: boolean;
    gameWon: boolean;
    flags: number;
}

@Injectable()
export class GameService {

    private status: IGameStatus;

    get Status(): IGameStatus {
        return this.status;
    }

    set Status( gameStatus: IGameStatus ) {
        this.status = gameStatus;
    }

    constructor( private gameLevel: GameLevelService,
                 private store: Store<any> ) {
    }

    public newGame(): void {
        this.resetGameStatus();
        let tiles = this.buildTileGrid();
        tiles = this.shuffle(tiles);
        tiles = this.setTilesContent(tiles);
        this.store.dispatch({type: STORE_TILES, payload: {tiles}});
    }

    public clickTile( tile: Tile ): void {
        // If the game is over, do nothing
        // If the clicked tile is covered, do nothing
        // If the clicked tile is revealed, do nothing
        if (this.status.gameOver || tile.Covered || tile.Revealed) return;

        // Hit a blank tile
        if (tile.Content === null) {
            this.store.dispatch(
                {
                    type: HIT_BLANK_TILE,
                    payload: {
                        tile,
                        width: this.gameLevel.GameLevel.width,
                        height: this.gameLevel.GameLevel.height
                    }
                });
            return;
        }

        // Hit a number tile
        if (tile.Content && tile.Content != 'mine') {
            this.store.dispatch({type: REVEAL_TILE, payload: tile.Id});
            return;
        }

        // Hit a mine tile
        if (tile.Content && tile.Content === 'mine') {
            this.store.dispatch({type: HIT_MINE, payload: tile.Id});
            return;
        }
    }

    public coverTile( tile: Tile ): void {
        if (tile.Revealed || this.status.gameOver) return;

        if (!tile.Covered && this.status.flags > 0) {
            this.store.dispatch({type: COVER_TILE, payload: tile.Id});
            return;
        } else {
            this.store.dispatch({type: UNCOVER_TILE, payload: tile.Id});
            return;
        }
    }

    public changeGameStatus( status: IGameStatus ) {
        this.status.gameWon = status.gameWon;
        this.status.gameOver = status.gameOver;
        this.status.flags = status.flags;
    }

    private buildTileGrid(): Tile[] {
        let tiles: Tile[] = [];
        let nonMineTileNum = this.gameLevel.GameLevel.height * this.gameLevel.GameLevel.width - this.gameLevel.GameLevel.mines;

        for (let i = 0; i < nonMineTileNum; i++) {
            let tile = new Tile();
            tiles.push(tile);
        }

        for (let i = 0; i < this.gameLevel.GameLevel.mines; i++) {
            let tile = new Tile('mine');
            tiles.push(tile);
        }

        return tiles;
    }

    // Random Shuffling An Array the Fisher-Yates (aka Knuth) Way
    private shuffle( list: Tile[] ): Tile[] {
        let currentIndex = list.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = list[currentIndex];
            list[currentIndex] = list[randomIndex];
            list[randomIndex] = temporaryValue;
        }

        return list;
    }

    private setTilesContent( tiles: Tile[] ): Tile[] {
        tiles.map(( tile: Tile, index: number ) => {

            // Set the tile coordination based on its index in the tiles array
            tile.Coordination = GameService.indexToCoordination(index, this.gameLevel.GameLevel.width);

            // check if the tile content is mine,
            // If it is not a mine, calculate the mines surrounding the tile and set its number
            if (tile.Content !== 'mine') {
                let surroundingMines: number = 0;
                GameService.getNeighbourTiles(tile, tiles, this.gameLevel.GameLevel.width, this.gameLevel.GameLevel.height, ( t: Tile ) => {
                    if (t.Content === 'mine') {
                        surroundingMines++;
                    }
                });
                tile.Content = surroundingMines ? surroundingMines.toString() : null;
            }
        });
        return tiles;
    }

    private resetGameStatus() {
        this.status = {
            gameStart: false,
            gameOver: false,
            gameWon: false,
            flags: this.gameLevel.GameLevel.mines
        }
    }

    public static getNeighbourTiles( tile: Tile, tiles: Tile[], width: number, height: number, cb: ( t: Tile ) => any ) {
        for (let tp of TraversalPaths) {
            let neighbour_x = tile.Coordination.x + tp.x,
                neighbour_y = tile.Coordination.y + tp.y;

            if (neighbour_x >= 0 && neighbour_x < width && neighbour_y >= 0 && neighbour_y < height) {
                let position = GameService.coordinationToIndex({x: neighbour_x, y: neighbour_y}, width);
                let tile = tiles[position];

                cb(tile);
            }
        }
    }

    public static indexToCoordination( index: number, width: number ): {x: number; y: number} {
        let x = index % width,
            y = (index - x) / width;

        return {x: x, y: y};
    }

    public static coordinationToIndex( coordination: {x: number, y: number}, width: number ): number {
        return coordination.x + coordination.y * width;
    }
}