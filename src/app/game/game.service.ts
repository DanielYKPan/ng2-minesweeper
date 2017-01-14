/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { STORE_TILES, REVEAL_TILE, UNCOVER_TILE, COVER_TILE } from "./actions.const";
import { Tile } from "./tile";
import { GameLevelService } from "./game-level.service";

const traversalPaths = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1}
];

@Injectable()
export class GameService {

    constructor( private gameLevel: GameLevelService,
                 private store: Store<any> ) {
    }

    public newGame(): void {
        let tiles = this.buildTileGrid();
        tiles = this.shuffle(tiles);
        tiles = this.setTilesContent(tiles);
        this.store.dispatch({type: STORE_TILES, payload: {tiles}});
    }

    public clickTile( tile: Tile ): void {
        this.store.dispatch({type: REVEAL_TILE, payload: tile.Id});
        return;
    }

    public coverTile( tile: Tile ): void {
        if (tile.Revealed) return;

        if (tile.Covered) {
            this.store.dispatch({type: UNCOVER_TILE, payload: tile.Id});
            return;
        } else {
            this.store.dispatch({type: COVER_TILE, payload: tile.Id});
            return;
        }
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

    private static getNeighbourTiles( tile: Tile, tiles: Tile[], width: number, height: number, cb: ( t: Tile ) => any ) {
        for (let i = 0; i < traversalPaths.length; i++) {
            let neighbour_x = tile.Coordination.x + traversalPaths[i].x,
                neighbour_y = tile.Coordination.y + traversalPaths[i].y;

            if (neighbour_x >= 0 && neighbour_x < width && neighbour_y >= 0 && neighbour_y < height) {
                let position = neighbour_x + neighbour_y * width;
                let tile = tiles[position];

                cb(tile);
            }
        }
    }

    private static indexToCoordination( index: number, width: number ): {x: number; y: number} {
        let x = index % width,
            y = (index - x) / width;

        return {x: x, y: y};
    }

    private static coordinationToIndex( coordination: {x: number, y: number}, width: number ): number {
        return coordination.x + coordination.y * width;
    }
}