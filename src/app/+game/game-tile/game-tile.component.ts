/**
 * game-tile.component
 */

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { Tile } from "../service";

@Component({
    selector: 'app-game-tile',
    templateUrl: './game-tile.component.html',
    styleUrls: ['./game-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GameTileComponent implements OnInit {

    @Input() tile: Tile;
    @Output() onClickTile = new EventEmitter<Tile>();
    @Output() onRightClickTile = new EventEmitter<Tile>();

    constructor() {
    }

    ngOnInit(): void {
    }

    clickTile(): void {
        this.onClickTile.emit(this.tile);
    }

    rightClickTile( event: MouseEvent, ): void {
        event.preventDefault();
        this.onRightClickTile.emit(this.tile);
    }
}