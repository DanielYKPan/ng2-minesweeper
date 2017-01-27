/**
 * game-board.component
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { GameLevelService, GameService, Tile, ILevel, IGameStatus, gameStatus  } from "../service";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit, OnDestroy {


    tiles$: Observable<Tile[]>;
    chosenLevel: ILevel;
    status: IGameStatus;

    private gameStatusSub: Subscription;

    constructor( private gameLevel: GameLevelService,
                 private gameService: GameService,
                 private store: Store<any>) {
    }

    ngOnInit(): void {
        this.newGame();
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
        if(this.gameStatusSub)
            this.gameStatusSub.unsubscribe()
    }

    newGame(): void {
        this.gameService.newGame();
        this.chosenLevel = this.gameLevel.GameLevel;
        this.status = this.gameService.Status;
    }

    clickTile( tile: Tile, isRightClick: boolean = false ): void {
        if (!this.status.gameStart)
            this.gameService.startGame();
        isRightClick ? this.gameService.coverTile(tile) : this.gameService.clickTile(tile);
    }
}
