"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const HmacUtils_1 = require("./HmacUtils");
class Pbkdf {
    constructor(digestAlgorithm) {
        this.digestAlgorithm = digestAlgorithm;
    }
    extract(password, salt, iterations, outputLen) {
        return new Uint8Array(crypto_1.default.pbkdf2Sync(Buffer.from(password), salt, iterations, outputLen, this.digestAlgorithm));
    }
    sha3256Pbkdf2(password, salt, iterations, outputLen) {
        const hmacLength = 32;
        const outputBuffer = Buffer.alloc(outputLen);
        const hmacOutput = Buffer.alloc(hmacLength);
        const block = Buffer.alloc(salt.length + 4);
        const leftLength = Math.ceil(outputLen / hmacLength);
        const rightLength = outputLen - (leftLength - 1) * hmacLength;
        salt.copy(block, 0, 0, salt.length);
        for (let i = 1; i <= leftLength; i++) {
            block.writeUInt32BE(i, salt.length);
            let hmac = Buffer.from(HmacUtils_1.HmacUtils.digestSha3256Hmac(password, block));
            hmac.copy(hmacOutput, 0, 0, hmacLength);
            for (let j = 1; j < iterations; j++) {
                hmac = Buffer.from(HmacUtils_1.HmacUtils.digestSha3256Hmac(password, hmac));
                for (let k = 0; k < hmacLength; k++) {
                    // tslint:disable-next-line:no-bitwise
                    hmacOutput[k] ^= hmac[k];
                }
            }
            const destPos = (i - 1) * hmacLength;
            const len = i === leftLength ? rightLength : hmacLength;
            hmacOutput.copy(outputBuffer, destPos, 0, len);
        }
        return outputBuffer;
    }
}
exports.Pbkdf = Pbkdf;
