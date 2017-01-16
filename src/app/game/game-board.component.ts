/**
 * game-board.component
 */

import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ILevel } from "./game-level.service";
import { Tile } from "./tile";
import { IGameStatus } from "./game.service";

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
    @Output() onClickTile = new EventEmitter<Tile>();
    @Output() onRightClickTile = new EventEmitter<Tile>();

    constructor() {
    }

    ngOnInit(): void {
    }

    clickSmiley() {
        this.onSmileyClick.emit(true);
    }

    clickTile( tile: Tile ): void {
        this.onClickTile.emit(tile);
    }

    rightClickTile( event: MouseEvent, tile: Tile ): void {
        event.preventDefault();
        this.onRightClickTile.emit(tile);
    }
}
