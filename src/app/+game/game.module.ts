/**
 * game.module
 */

import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { RouterModule } from "@angular/router";
import { GameComponent } from "./game.component";
import { routes } from './game.routes';
import { GameBoardComponent } from "./game-board/game-board.component";
import { GameService, GameLevelService, tiles } from "./service";
import { GameTileComponent } from "./game-tile";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        StoreModule.provideStore({
            tiles
        }),
    ],
    declarations: [
        GameComponent,
        GameBoardComponent,
        GameTileComponent,
    ],
    exports: [],
    providers: [
        GameService,
        GameLevelService
    ]
})
export class GameModule {
    public static routes = routes;
}
