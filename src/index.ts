script.name = "NBS Radio";
script.author = "JayRSky";
script.description = "Plays .nbs sounds!";

let cmd = new Command("nbs", "Plays an NBS Song!", "<songFile>", ["nbsplay"]);
const fs = require("filesystem");

import { nbs } from "./nbs/File"
import { NotePlayer } from "./nbs/Player";
import { Song } from "./nbs/Song";
import { DynamicBuffer } from "./util/DynamicBuffer";
import { formatSeconds, slog } from "./util/Utils";

import './ui'

export const notePlayer = new NotePlayer();

cmd.on("execute", (_, args) => {
    if (args.length < 1) {
        return false; // print the usage
    }

    switch (args[0]) {
    case 'stop':
        if (notePlayer.isPlaying()) notePlayer.stop();
        slog(`Stopped current song`)
        return true;
    }

    let buf: Uint8Array | null = null;

//script.log(`${TextColor.RED}Could not find NBS file ${args[0]}`);

    if (!fs.existsSync(args[0])) {
        slog(`Could not find NBS file ${args[0]}`, true);
        return true;
    }


    fs.read(args[0], (err, content) => {
        
        if (err != 0) {
            slog(`Could not open NBS file ${args[0]}`, true);
        }

        let myFile = nbs.File.parse(new DynamicBuffer(content));
        let mySong = new Song(myFile.songName, myFile.songAuthor, myFile.songOriginalAuthor, myFile.songTempo, myFile.songLength);
        mySong.layers = myFile.layers;

        notePlayer.setSong(mySong);
    })

    return true;
})


let cmdModeCmd = new Command("nbscommandmode", "Set NBSRadio to use commands instead (be careful)", "", []);
cmdModeCmd.on("execute", () => {
    notePlayer.commandMode = !notePlayer.commandMode;
    slog(`Command mode is ON`)
    return true;
})

client.getCommandManager().registerCommand(cmd);

client.on('key-press', ev => {
    if (!notePlayer.isPlaying()) return;
    if (game.isInUI()) return;
    
    if (ev.isDown) {
        if (ev.keyCode == KeyCode.K) {
            if (notePlayer.isPaused()) {
                notePlayer.resume();
            } else notePlayer.pause();
        }

        if (ev.keyCode == KeyCode.J) {
            notePlayer.restart();
        }

        if (ev.keyCode == KeyCode.Comma) {
            notePlayer.slower();
        }

        if (ev.keyCode == KeyCode.Dot) {
            notePlayer.faster();
        }
    }
})

client.on("unload-script", ev => {
    if (ev.scriptName == script.name) {
        client.getCommandManager().deregisterCommand(cmd);
        client.getCommandManager().deregisterCommand(cmdModeCmd);
    }
})

client.on('renderDX', () => {
    notePlayer.onTick();
})

client.getCommandManager().registerCommand(cmdModeCmd)

setInterval(() => {
    if (!notePlayer.isPlaying()) return;
    script.log(`${formatSeconds(notePlayer.getSeconds())} / ${formatSeconds(notePlayer.getSongLengthSeconds())}`)
}, 10000);