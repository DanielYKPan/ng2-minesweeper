/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import {
    STORE_TILES, REVEAL_TILE, UNCOVER_TILE, COVER_TILE, HIT_MINE,
    REVEAL_ALL
} from "./actions.const";
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

    private tiles: Tile[];

    get Status(): IGameStatus {
        return this.status;
    }

    constructor( private gameLevel: GameLevelService,
                 private store: Store<any> ) {
        this.store.select('tiles').subscribe(
            ( data: Tile[] ) => {
                this.tiles = data;
            }
        );
    }

    public newGame(): void {
        this.resetGameStatus();
        let tiles = this.buildTileGrid();
        tiles = shuffle(tiles);
        tiles = this.setTilesContent(tiles);
        this.store.dispatch({type: STORE_TILES, payload: {tiles}});
    }

    public clickTile( tile: Tile ): void {
        // If the game is over, do nothing
        // If the clicked tile is covered, do nothing
        // If the clicked tile is revealed, do nothing
        if (this.status.gameOver || tile.Covered || tile.Revealed) return;

        // Hit a non-mine tile
        if (tile.Content === null || (tile.Content && tile.Content != 'mine')) {
            this.hitNonMineTile(tile);
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

    public startGame(): void {
        this.status.gameStart = true;
    };

    public changeGameStatus( status: IGameStatus ) {
        this.status.gameWon = status.gameWon;
        this.status.gameOver = status.gameOver;
        this.status.flags = status.flags;

        if (this.status.gameOver && this.status.gameWon) {
            this.revealAll();
        }
    }

    private revealAll(): void {
        this.store.dispatch({type: REVEAL_ALL});
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

    private setTilesContent( tiles: Tile[] ): Tile[] {
        tiles.map(( tile: Tile, index: number ) => {

            // Set the tile coordination based on its index in the tiles array
            tile.Coordination = indexToCoordination(index, this.gameLevel.GameLevel.width);

            // check if the tile content is mine,
            // If it is not a mine, calculate the mines surrounding the tile and set its number
            if (tile.Content !== 'mine') {
                let surroundingMines: number = 0;
                this.getNeighbourTiles(tile, ( t: Tile ) => {
                    if (t.Content === 'mine') {
                        surroundingMines++;
                    }
                }, tiles);
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

    private hitNonMineTile( tile: Tile ): void {
        if(!tile.Revealed && !tile.Covered) {
            this.store.dispatch({type: REVEAL_TILE, payload: tile.Id});

            if(tile.Content === null) {
                this.getNeighbourTiles(tile, (t) => {
                    if (t.Content !== 'mine') {
                        this.hitNonMineTile(t);
                    }
                });
            }
            return;
        }
        return;
    }

    private getNeighbourTiles( tile: Tile, cb: ( t: Tile ) => any, tiles?: Tile[], ) {
        for (let tp of TraversalPaths) {
            let neighbour_x = tile.Coordination.x + tp.x,
                neighbour_y = tile.Coordination.y + tp.y;

            if (neighbour_x >= 0 && neighbour_x < this.gameLevel.GameLevel.width && neighbour_y >= 0 && neighbour_y < this.gameLevel.GameLevel.height) {
                let position = coordinationToIndex({
                    x: neighbour_x,
                    y: neighbour_y
                }, this.gameLevel.GameLevel.width);

                let tile;
                if (tiles) {
                    tile = tiles[position];
                } else {
                    tile = this.tiles[position];
                }

                cb(tile);
            }
        }
    }
}

/* Change coordination to index */
const coordinationToIndex = ( coordination: {x: number, y: number}, width: number ): number => {
    return coordination.x + coordination.y * width;
};

/* Transform index to coordination */
const indexToCoordination = ( index: number, width: number ): {x: number; y: number} => {
    let x = index % width,
        y = (index - x) / width;

    return {x: x, y: y};
};

// Random Shuffling An Array the Fisher-Yates (aka Knuth) Way
const shuffle = ( list: Array<Tile> ): Array<Tile> => {
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
};
