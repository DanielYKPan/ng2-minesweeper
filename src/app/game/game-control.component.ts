/**
 * game-control.component
 */

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ILevel } from "./game-level.service";

@Component({
    selector: 'app-game-control',
    templateUrl: './game-control.component.html',
    styleUrls: ['./game-control.component.scss']
})

export class GameControlComponent implements OnInit {

    @Input() levels: ILevel[];
    @Input() chosenLevel: ILevel;
    @Output() onChangeLevel = new EventEmitter<ILevel>();

    constructor() {
    }

    ngOnInit(): void {
    }

    changeLevel(level: ILevel): void {
        this.onChangeLevel.emit(level);
    }
}
