import { Layer } from "./Layer";

export class Song {
    public layers: Map<number, Layer> = new Map();
    public name: string;
    public author: string;
    public originalAuthor: string;
    public tempo: number;
    public length: number;

    constructor(name: string, author: string, ogAuthor: string,
        tempo: number, length: number) {
            this.name = name;
            this.author = author;
            this.originalAuthor = ogAuthor;
            this.tempo = tempo;
            this.length = length;
        }
}