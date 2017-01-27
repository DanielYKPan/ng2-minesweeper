/**
 * game.routes
 */

import { GameComponent } from './game.component';
import { GameBoardComponent } from "./game-board";

export const routes = [
    {
        path: '',
        component: GameComponent,
        children: [
            {path: '', component: GameBoardComponent},
        ]
    },
];
