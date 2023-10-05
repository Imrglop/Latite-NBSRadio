import { Note } from "./Note";

export class Layer {
    public notes: Map<number, Note> = new Map();

    // TODO: layer-specific stuff (in newer format versions)
    constructor() {
    }
}