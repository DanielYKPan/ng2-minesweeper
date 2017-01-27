/**
 * game-level.service
 */

import { Injectable } from '@angular/core';

enum Level {
    JUNIOR,
    SENIOR,
    MASTER
}

export interface ILevel {
    name: string;
    width: number;
    height: number;
    mines: number;
}

export const LEVELS: ILevel[] = [
    {name: Level[Level.JUNIOR].toLowerCase(), width: 8, height: 8, mines: 10 },
    {name: Level[Level.SENIOR].toLowerCase(), width: 16, height: 16, mines: 40 },
    {name: Level[Level.MASTER].toLowerCase(), width: 30, height: 16, mines: 99 }
];

@Injectable()
export class GameLevelService {

    private gameLevel: ILevel = LEVELS[Level.JUNIOR];

    get GameLevel() {
        return this.gameLevel
    }

    set GameLevel(level: ILevel) {
        this.gameLevel = level
    };

    constructor() {
    }
}