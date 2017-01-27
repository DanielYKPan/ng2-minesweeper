/**
 * game.module
 */

import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { GameComponent } from "./game.component";
import { RouterModule } from "@angular/router";
import { routes } from './game.routes';
import { GameBoardComponent } from "./game-board/game-board.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        GameComponent,
        GameBoardComponent,
    ],
    exports: [],
    providers: []
})
export class GameModule {
    public static routes = routes;
}
