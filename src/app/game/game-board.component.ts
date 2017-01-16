/**
 * game-board.component
 */

import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ILevel } from "./game-level.service";
import { Tile } from "./tile";
import { GameService, IGameStatus } from "./game.service";
import "rxjs/add/operator/let";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";

@Component({
    selector: 'app-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {

    @Input() status: IGameStatus;
    @Input() tiles: Tile[];
    @Input() level: ILevel;
    @Output() onSmileyClick = new EventEmitter<boolean>();

    constructor( private gameService: GameService ) {
    }

    ngOnInit(): void {
    }


    clickTile( tile: Tile, isRightClick: boolean = false ): void {
        isRightClick ? this.gameService.coverTile(tile) : this.gameService.clickTile(tile);
    }

    clickSmiley() {
        this.onSmileyClick.emit(true);
    }
}
