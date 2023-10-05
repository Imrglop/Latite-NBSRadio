import { formatSeconds } from "../util/Utils";
import { Song } from "./Song";

export class NotePlayer {
    public song: Song | null = null;
    private currentTick: number = 0;
    private lastTime: number = 0;

    private tempo = 0;
    private paused: boolean = false;
    public commandMode: boolean = false;
    public loop: boolean = true;

    constructor() {
    }

    public getSongLengthSeconds() {
        return this.song!.length / this.tempo;
    }

    public getSeconds() {
        return this.currentTick / this.tempo;
    }

    public slower() {
        if (!this.song) return;
        this.tempo -= 0.5;
        script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: (Slow Down) New tempo is ${this.song.tempo}`)
    }

    public faster() {
        if (!this.song) return;
        this.tempo += 0.5;
        script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: (Speed Up) New tempo is ${this.song.tempo}`)
    }

    public setSong(song: Song): void {
        this.song = song;
        script.log(`${TextColor.GREEN}${TextColor.BOLD}Now Playing\n${TextColor.RESET}${TextColor.GREEN}${song.name} by ${song.originalAuthor}\nSong Tempo: ${song.tempo}`)
        script.log(`Song Length: ${formatSeconds(this.getSongLengthSeconds())}`)

        this.currentTick = 0;
        this.lastTime = Date.now();
        this.paused = false;
        this.tempo = song.tempo;
    }

    public isPlaying(): boolean {
        return this.song ? true : false;
    }

    public pause() {
        script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: Paused`)

        this.paused = true;
    }

    public resume() {
        script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: Resumed`)
        this.paused = false;
    }

    public stop() {
        script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: Stopped`)
        this.song = null;
    }

    public isPaused() {
        return this.paused;
    }

    public restart() {
        if (this.song) {
            script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: Restarting Song`)
            this.currentTick = -10;
        }
    }

    public onTick(): void {
        if (this.song) {
            if (this.paused) return;
            if (!game.getLocalPlayer()) return;
            if (this.song.length != 0 && this.currentTick > this.song.length) {
                this.restart();
                return;
            }

            let songSpeed = 20 / this.tempo;
            let time = Date.now();
            let diff = time - this.lastTime;

            if (diff < (songSpeed * 50)) {
                return;
            }
            this.lastTime = time;

            // Step 1: Go through all layers
            for (let [_, layer] of this.song.layers) {
                // Step 2: Go through all ticks in the layers
                for (let [tk, note] of layer.notes) {
                    if (this.currentTick == tk) {
                        if (this.commandMode) {
                            game.executeCommand(`/playsound ${note.sound} @a ~ ~ ~ ${note.volume} ${note.pitch}`)
                        } else
                        // the moment we've all (me) been waiting for:
                        game.playSoundUI(note.sound, note.volume, note.pitch);
                    }
                }
            }

            ++this.currentTick;
        }
    }
}