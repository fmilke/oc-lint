
export class ParseError {
    constructor(public start: number, public end: number, public message: string) {}
}