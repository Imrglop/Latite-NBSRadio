// https://opennbs.org/nbs#part1

import { DynamicBuffer } from "../util/DynamicBuffer";
import { Layer } from "./Layer";
import { Note } from "./Note";

export namespace nbs {
    export class File {
        public begin: number = 0;
        public version: number = 0;

        public instrumentCount = 0;
        public songLength = 0;
        public layerCount = 0;
        public songName = "";
        public songAuthor = "";
        public songOriginalAuthor = "";
        public songDescription = "";
        public songTempo = 0;
        
        /// Map<currentLayer, Layer>
        public layers: Map<number, Layer> = new Map(); 

        public static parse(buf: DynamicBuffer) {
            let file: File = new File();

            // PART 1: Header

            file.begin = buf.readShort();
            if (!file.begin) {
                script.log("New NBS format detected");
            } else script.log("Old NBS format detected");

            if (!file.begin) {
                file.version = buf.readUint8();
                file.instrumentCount = buf.readUint8();
                if (file.version >= 3) file.songLength = buf.readShort();
            } else {
                file.version = 0;
                file.songLength = file.begin;
            }

            file.layerCount = buf.readShort();
            file.songName = buf.readNBSString();
            file.songAuthor = buf.readNBSString();
            file.songOriginalAuthor = buf.readNBSString();
            file.songDescription = buf.readNBSString();
            file.songTempo = buf.readShort() / 100;

            buf.readUint8(); // autosaving
            buf.readUint8(); // autosaveduration
            buf.readUint8(); // timesignature
            
            buf.readInt(); // minutesSpent
            buf.readInt(); // leftClicks
            buf.readInt(); // rightClicks
            buf.readInt(); // noteBlocksAdded
            buf.readInt(); // noteblocksRemoved
            buf.readNBSString(); // schematicName

            if (file.version >= 4) {
                buf.readUint8(); // shouldLoop
                buf.readUint8(); // maxLoop
                buf.readShort(); // loopStartTick
            }

            // PART 2: Noteblocks

            let tick = -1;
            while (true) {
                let jumps = buf.readShort();
                if (jumps == 0) break; // no more noteblocks
                tick += jumps;

                let layer = -1;
                while (true) {
                    let jmpNextLayer = buf.readShort();
                    if (jmpNextLayer == 0) break; // no more layers
                    layer += jmpNextLayer;

                    let myLayer: Layer;
                    if (file.layers.has(layer)) {
                        myLayer = file.layers.get(layer)!;
                    } else {
                        myLayer = new Layer();
                    }

                    let instrument = buf.readUint8();
                    let key = buf.readUint8();

                    let volume = 1;
                    //let panning = 100;
                    let pitch = 1;


                    if (file.version >= 4) {
                        volume = buf.readUint8() / 100;
                        buf.readUint8(); // panning
                        pitch = buf.readShort(); // pitch
                        // idk how the new pitch works send help
                    }

                    // https://minecraft.gamepedia.com/Note_Block#Notes
                    pitch = 2 ** ((key - 45) / 12);
                    
                    let note = new Note(instrument, key, volume, pitch);
                    myLayer.notes.set(tick, note);
                    file.layers.set(layer, myLayer);
                }
            }

            return file;
        }
    }
}