"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("../../lib/bignumber.js"));
/**
 * A wrapper around byte buffers to perform cursor reading on bytes
 * of different sizes
 *
 */
class CursorBuffer {
    constructor(typedArray, littleEndian = true) {
        this.dataView = new DataView(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        this.littleEndian = littleEndian;
        this.bytePositon = 0;
    }
    /**
     * Reads 1 byte
     *
     */
    read8() {
        const value = this.dataView.getUint8(this.bytePositon);
        this.bytePositon += 1;
        return value;
    }
    /**
     * Reads 4 bytes
     *
     */
    read32() {
        const value = this.dataView.getUint32(this.bytePositon, this.littleEndian);
        this.bytePositon += 4;
        return value;
    }
    /**
     * Reads 8 bytes
     *
     *
     */
    read64() {
        const firstPart = this.read32();
        const secondPart = this.read32();
        const combined = this.littleEndian
            ? secondPart.toString(16) + firstPart.toString(16).padStart(8, '0')
            : firstPart.toString(16) + secondPart.toString(16).padStart(8, '0');
        return new bignumber_js_1.default(`0x${combined}`, 16);
    }
    readXBytes(x) {
        const startPosition = this.bytePositon + this.dataView.byteOffset;
        const value = new Uint8Array(this.dataView.buffer, startPosition, x);
        this.bytePositon += x;
        return value;
    }
}
exports.CursorBuffer = CursorBuffer;
