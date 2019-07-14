"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39_1 = require("../lib/bip39");
const CollectionUtil_1 = __importDefault(require("../libra-web-core-utils/common/CollectionUtil"));
const MnemonicWords_1 = __importDefault(require("../libra-web-core-utils/constants/MnemonicWords"));
/**
 * Handles logic for loading, writing and encoding mnemonic strings
 *
 */
class Mnemonic {
    constructor(words) {
        if (!words) {
            const mnemonic = bip39_1.generateMnemonic(256);
            this.words = mnemonic.split(' ');
            return;
        }
        if (words.length < 6 || words.length % 6 !== 0) {
            throw new Error('Mnemonic must have a word count divisible with 6');
        }
        for (const word of words) {
            if (CollectionUtil_1.default.binarySearch(MnemonicWords_1.default, word) === null) {
                throw new Error('Mnemonic contains an unknown word');
            }
        }
        this.words = words;
    }
    toString() {
        return this.words.join(' ');
    }
    toBytes() {
        // works only because mnemonic characters are asci
        const wordsString = this.toString();
        const buffer = new ArrayBuffer(wordsString.length);
        const uintArray = new Uint8Array(buffer);
        uintArray.forEach((_, idx) => {
            uintArray[idx] = wordsString.charCodeAt(idx);
        });
        return uintArray;
    }
}
exports.Mnemonic = Mnemonic;
