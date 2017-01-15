/**
 * game-board.component
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { GameLevelService, ILevel } from "./game-level.service";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { Tile } from "./tile";
import { GameService, IGameStatus } from "./game.service";
import "rxjs/add/operator/let";
import "rxjs/add/operator/map";
import { gameStatus } from "./tiles.reducer";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit, OnDestroy {

    private level: ILevel;
    private gameStatus: IGameStatus;
    private tiles$: Observable<any>;
    private gameStatusSub: Subscription;

    constructor( private gameLevel: GameLevelService,
                 private gameService: GameService,
                 private store: Store<any> ) {
    }

    ngOnInit(): void {
        this.level = this.gameLevel.GameLevel;
        this.gameStatus = this.gameService.Status;
        this.tiles$ = this.store.select('tiles');
        this.gameStatusSub = this.tiles$.let(gameStatus()).subscribe(
            ( data: IGameStatus ) => this.gameService.changeGameStatus(data)
        );
    }

    ngOnDestroy(): void {
        this.gameStatusSub.unsubscribe();
    }

    clickTile( tile: Tile, isRightClick: boolean = false ): void {
        isRightClick ? this.gameService.coverTile(tile) : this.gameService.clickTile(tile);
    }
}
