/**
 * tiles.reducer
 */

import { ActionReducer } from "@ngrx/store";
import { Tile } from "./tile";
import { STORE_TILES, REVEAL_TILE, COVER_TILE, UNCOVER_TILE } from "./actions.const";

export const tiles: ActionReducer<Tile[]> = ( state: Tile[] = [], action: any ) => {
    switch (action.type) {
        case STORE_TILES:
            return Object.assign([], action.payload.tiles);

        case REVEAL_TILE:
        case COVER_TILE:
        case UNCOVER_TILE:
            return state.map(( tile, index ) => details(tile, action));

        default:
            return state;
    }
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

        default:
            return state;
    }
}
