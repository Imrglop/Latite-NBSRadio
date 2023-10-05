export class Note {
    static Sounds = [
        "note.harp", // Air
        "note.bass", // Wood
        "note.bd", // Stone
        "note.snare", // Sand
        "note.hat", // glass
        "note.guitar", // wool
        "note.flute", // clay
        "note.bell", // Gold Block
        "note.xylophone", // Bone Block
        "note.iron_xylophone", // iron block
        "note.cow_bell", // ss
        "note.didgeridoo", // pmpkin
        "note.bit",
        "note.banjo",
        "note.pling", // glowstone
    ];

    public id;
    public key;
    public sound;
    public volume;
    public pitch;

    constructor(id: number, key: number, volume = 1, pitch = 1) {
        this.id = id;
        this.key = key;
        this.sound = Note.Sounds[id];
        this.volume = volume;
        this.pitch = pitch;
        if (this.sound == undefined) throw new Error("Unknown note " + id)
    }
}