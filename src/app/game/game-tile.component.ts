/**
 * game-tile.component
 */

import { Component, OnInit, Input } from "@angular/core";
import { Tile } from "./tile";

@Component({
    selector: 'app-game-tile',
    templateUrl: './game-tile.component.html',
    styleUrls: ['./game-tile.component.scss']
})

export class GameTileComponent implements OnInit {

    @Input() tile: Tile;

    constructor() {
    }

    ngOnInit(): void {
    }
}