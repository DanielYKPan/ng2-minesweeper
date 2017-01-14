/**
 * tile
 */

import { uuid } from "./uuid";

export class Tile {

    /* Property id */
    private id: string;

    get Id(): string {
        return this.id;
    }

    /* Property content */
    private content: string;

    get Content(): string {
        return this.content
    }
    set Content(value: string) {
        this.content = value;
    }

    /* Property covered */
    private covered: boolean;

    get Covered(): boolean {
        return this.covered
    }
    set Covered(value: boolean) {
        this.covered = value;
    }

    /* Property revealed */
    private revealed: boolean;

    get Revealed(): boolean {
        return this.revealed
    }
    set Revealed(value: boolean) {
        this.revealed = value;
    }

    /* Property coordination */
    private coordination: {x: number, y: number};

    get Coordination(): {x: number, y: number} {
        return this.coordination
    }
    set Coordination(value: {x: number, y: number}) {
        this.coordination = value;
    }

    constructor( content?: string ) {
        this.id = uuid();
        this.covered = false;
        this.revealed = false;
        this.coordination = null;
        this.content = content || null;
    }
}
