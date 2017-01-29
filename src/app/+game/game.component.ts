/**
 * game.component
 */


import { Component, OnInit } from "@angular/core";
import { GameService } from "./service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

    constructor( private router: Router,
                 private gameService: GameService ) {
    }

    ngOnInit(): void {
    }

    newGame() {
        if(this.router.url == '/game') {
            this.gameService.newGame();
        } else {
            this.router.navigate(['/game']);
        }
    }

    checkAbout() {
        this.router.navigate(['/game/about']);
    }
}