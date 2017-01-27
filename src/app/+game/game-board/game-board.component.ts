/**
 * game-board.component
 */

import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { GameLevelService, GameService, Tile, ILevel, IGameStatus  } from "../service";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

    tiles$: Observable<Tile[]>;
    chosenLevel: ILevel;
    status: IGameStatus;
    constructor( private gameLevel: GameLevelService,
                 private gameService: GameService,
                 private store: Store<any>) {
    }

    ngOnInit(): void {
        this.newGame();
        this.tiles$ = this.store.select('tiles');
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
