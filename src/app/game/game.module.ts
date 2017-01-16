/**
 * game.module
 */

import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { GameComponent } from "./game.component";
import { GameBoardComponent } from "./game-board.component";
import { GameTileComponent } from "./game-tile.component";
import { GameControlComponent } from "./game-control.component";
import { GameTimerComponent } from "./game-timer.component";
import { tiles } from "./tiles.reducer";
import { GameService } from "./game.service";
import { GameLevelService } from "./game-level.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StoreModule.provideStore({
            tiles
        }),
    ],
    declarations: [
        GameComponent,
        GameBoardComponent,
        GameTileComponent,
        GameTimerComponent,
        GameControlComponent,
    ],
    exports: [
        GameComponent
    ],
    providers: [
        GameService,
        GameLevelService
    ]
})
export class GameModule {
}
