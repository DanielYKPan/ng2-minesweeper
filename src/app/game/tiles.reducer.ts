/**
 * tiles.reducer
 */

import { ActionReducer } from "@ngrx/store";
import { Tile } from "./tile";
import { STORE_TILES } from "./actions.const";

export const tiles: ActionReducer<Tile[]> = ( state: Tile[] = [], action: any) => {
    switch (action.type) {
        case STORE_TILES:
            return Object.assign([], action.payload.tiles);

        default:
            return state;
    }
};
