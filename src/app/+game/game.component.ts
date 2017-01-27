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
        this.router.navigate(['']);
        this.gameService.newGame();
    }

    checkAbout() {
        this.router.navigate(['/game/about']);
    }
}