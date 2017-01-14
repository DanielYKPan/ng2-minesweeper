/**
 * game-board.component
 */

import { Component, OnInit } from "@angular/core";
import { GameLevelService, ILevel } from "./game-level.service";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Tile } from "./tile";
import { GameService } from "./game.service";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

    private level: ILevel;
    private tiles$: Observable<any>;

    constructor( private gameLevel: GameLevelService,
                 private gameService: GameService,
                 private store: Store<any> ) {
    }

    ngOnInit(): void {
        this.level = this.gameLevel.GameLevel;
        this.tiles$ = this.store.select('tiles');
    }

    clickTile( tile: Tile, isRightClick: boolean = false ): void {
        isRightClick ? this.gameService.coverTile(tile) : this.gameService.clickTile(tile);
    }
}
