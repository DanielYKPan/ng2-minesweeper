/**
 * game.component
 */

import { Component, OnInit } from '@angular/core';
import { GameService } from "./game.service";

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    constructor( private gameService: GameService ) {
    }

    ngOnInit() {
        this.gameService.newGame();
    }
}
