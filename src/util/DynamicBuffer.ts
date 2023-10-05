export class DynamicBuffer {
    private underlyingBuffer: Buffer;

    constructor(buf: Buffer) {
        this.underlyingBuffer = buf;
    }

    move(amount: number) {
        this.underlyingBuffer = this.underlyingBuffer.slice(amount);
    }

    readShort() {
        let num = this.underlyingBuffer.readInt16(0);
        this.move(2);
        return num;
    }

    readString() {
        let str = this.underlyingBuffer.readString(0);
        this.move(str.length + 1 /*NUL character*/);
        return str;
    }

    readUint8() {
        let num = this.underlyingBuffer[0];
        this.move(1);
        return num;
    }

    readInt() {
        let num = this.underlyingBuffer.readInt32(0);
        this.move(4);
        return num;
    }

    readNBSString() {
        let numChars = this.readInt();
        let str = "";
        for (let i = 0; i < numChars; ++i) {
            str += String.fromCharCode(this.underlyingBuffer[i]);
        }
        this.move(numChars);
        return str;
    }
}