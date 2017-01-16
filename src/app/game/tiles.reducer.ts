/**
 * tiles.reducer
 */

import { ActionReducer } from "@ngrx/store";
import { Tile } from "./tile";
import { STORE_TILES, REVEAL_TILE, COVER_TILE, UNCOVER_TILE, HIT_MINE, HIT_BLANK_TILE } from "./actions.const";
import { IGameStatus, GameService } from "./game.service";
import "rxjs/add/operator/let";
import "rxjs/add/operator/map";
import "rxjs/add/operator/distinctUntilChanged";

export const tiles: ActionReducer<Tile[]> = ( state: Tile[] = [], action: any ) => {

    let hitBlankTile = ( hitTile: Tile, width: number, height: number ) => {
        if (!hitTile.Revealed && !hitTile.Covered) {

            // reveal the hit tile
            let index = GameService.coordinationToIndex(hitTile.Coordination, width);
            let newTile = Object.assign(new Tile(), hitTile, {Revealed: true});
            state = state.slice(0, index)
                .concat(newTile)
                .concat(state.slice(index + 1));

            // if the hitTile is blank tile,
            // we will reveal all its neighbour non-mine tiles
            if (hitTile.Content === null) {
                GameService.getNeighbourTiles(hitTile, state, width, height, ( t ) => {
                    if (t.Content !== 'mine') {
                        hitBlankTile(t, width, height);
                    }
                });
            }
        }
    };

    switch (action.type) {
        case STORE_TILES:
            return Object.assign([], action.payload.tiles);

        case REVEAL_TILE:
        case COVER_TILE:
        case UNCOVER_TILE:
        case HIT_MINE:
            return state.map(( tile, index ) => details(tile, action));

        case HIT_BLANK_TILE:
            hitBlankTile(action.payload.tile, action.payload.width, action.payload.height);
            return state;
        default:
            return state;
    }
};

export const gameStatus = () => {
    return ( state: any ) => state
        .distinctUntilChanged()
        .map(( tiles: Tile[] ) => {
            const mineTiles = tiles.filter(t => t.Content === 'mine' || t.Content === 'mine-wrong');
            const flaggedTiles = tiles.filter(t => t.Covered);

            let status: IGameStatus = {
                gameOver: false,
                gameWon: false,
                flags: mineTiles.length - flaggedTiles.length
            };

            let minesCovered = 0;

            for (let mineTile of mineTiles) {
                if (mineTile.Revealed) {
                    status.gameOver = true;
                    break;
                } else if (!mineTile.Revealed && mineTile.Covered) {
                    minesCovered++;
                }
            }

            if (!status.gameOver && minesCovered === mineTiles.length) {
                status.gameOver = true;
                status.gameWon = true;
            }

            return status;
        });
};

function details( state: Tile, action: any ): any {
    switch (action.type) {
        case REVEAL_TILE:
            if (state.Id === action.payload && !state.Revealed) {
                return Object.assign(new Tile(), state, {revealed: true});
            } else {
                return state;
            }

        case  COVER_TILE:
            if (state.Id === action.payload && !state.Covered && !state.Revealed) {
                return Object.assign(new Tile(), state, {covered: true});
            }
            return state;

        case UNCOVER_TILE:
            if (state.Id === action.payload && state.Covered) {
                return Object.assign(new Tile(), state, {covered: false});
            }
            return state;

        case HIT_MINE:
            if (state.Id === action.payload && state.Content === "mine")
                return Object.assign(new Tile(), state, {revealed: true, content: 'mine-wrong'});
            if (state.Id != action.payload && state.Content === 'mine' && !state.Covered)
                return Object.assign(new Tile(), state, {revealed: true});
            if (state.Id != action.payload && state.Content != "mine" && state.Covered)
                return Object.assign(new Tile(), state, {revealed: true, content: 'flag-mine-wrong'});
            return state;

        default:
            return state;
    }
}
