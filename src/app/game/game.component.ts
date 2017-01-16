/**
 * game.component
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, IGameStatus } from "./game.service";
import { Store } from "@ngrx/store";
import { Tile } from "./tile";
import { Observable, Subscription } from "rxjs";
import { gameStatus } from "./tiles.reducer";
import { GameLevelService, ILevel, LEVELS } from "./game-level.service";
import "rxjs/add/operator/let";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {

    private status: IGameStatus;
    private tiles$: Observable<Tile[]>;
    private gameStatusSub: Subscription;
    private chosenLevel: ILevel;
    private levels: ILevel[];

    constructor( private gameLevel: GameLevelService,
                 private gameService: GameService,
                 private store: Store<any> ) {
    }

    ngOnInit() {
        this.newGame();
        this.levels = LEVELS;
        this.tiles$ = this.store.select('tiles');
        this.gameStatusSub = this.tiles$
            .let(gameStatus())
            .distinctUntilChanged(
                ( a: IGameStatus, b: IGameStatus ) => {
                    return a.gameWon == b.gameWon && a.gameOver == b.gameOver && a.flags == b.flags;
                }) // Use distinctUntilChanged to check if the gameStatus has changed
            .subscribe(
                ( data: IGameStatus ) => this.gameService.changeGameStatus(data)
            );
    }

    ngOnDestroy(): void {
        this.gameStatusSub.unsubscribe();
    }

    clickTile( tile: Tile, isRightClick: boolean = false ): void {
        if (!this.status.gameStart)
            this.gameService.startGame();
        isRightClick ? this.gameService.coverTile(tile) : this.gameService.clickTile(tile);
    }

    newGame(): void {
        this.gameService.newGame();
        this.chosenLevel = this.gameLevel.GameLevel;
        this.status = this.gameService.Status;
    }

    changeGameLevel( level: ILevel ): void {
        this.gameLevel.GameLevel = level;
        this.newGame();
    }
}
