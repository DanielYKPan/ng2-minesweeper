/**
 * game-tile.component
 */

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Tile } from "./tile";

@Component({
    selector: 'app-game-tile',
    templateUrl: './game-tile.component.html',
    styleUrls: ['./game-tile.component.scss']
})

export class GameTileComponent implements OnInit {

    @Input() tile: Tile;
    @Output() onClickTile = new EventEmitter<Tile>();

    constructor() {
    }

    ngOnInit(): void {
    }

    clickTile(): void {
        if (this.tile)
            this.onClickTile.emit(this.tile);
    }
}