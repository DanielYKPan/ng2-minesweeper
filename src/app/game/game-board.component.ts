/**
 * game-board.component
 */

import { Component, OnInit } from "@angular/core";
import { GameLevelService, ILevel } from "./game-level.service";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Tile } from "./tile";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

    private level: ILevel;
    private tiles$: Observable<any>;

    constructor( private gameLevel: GameLevelService,
                 private store: Store<any> ) {
    }

    ngOnInit(): void {
        this.level = this.gameLevel.GameLevel;
        this.tiles$ = this.store.select('tiles');
    }

    revealTile(tile: Tile): void {
        console.log(tile.Id);
    }
}
