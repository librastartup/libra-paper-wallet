"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KeyPrefixes_1 = __importDefault(require("../libra-web-core-utils/constants/KeyPrefixes"));
const Eddsa_1 = require("../libra-web-core-utils/crypto/Eddsa");
const Hkdf_1 = require("../libra-web-core-utils/crypto/Hkdf");
const Pbkdf_1 = require("../libra-web-core-utils/crypto/Pbkdf");
const Mnemonic_1 = require("./Mnemonic");
/**
 * Seed is used by KeyFactory to generate
 * new key pairs for accounts
 *
 */
class Seed {
    static fromMnemonic(words, salt = 'LIBRA') {
        const mnemonic = Array.isArray(words) ? new Mnemonic_1.Mnemonic(words) : words;
        const bytes = new Pbkdf_1.Pbkdf('sha3-256').sha3256Pbkdf2(Buffer.from(mnemonic.toBytes()), Buffer.from(`${KeyPrefixes_1.default.MnemonicSalt}${salt}`), 2048, 32);
        return new Seed(bytes);
    }
    /**
     *
     */
    constructor(data) {
        if (data.length !== 32) {
            throw new Error('Seed data length must be 32 bits');
        }
        this.data = data;
    }
}
exports.Seed = Seed;
class KeyFactory {
    constructor(seed) {
        this.seed = seed;
        this.hkdf = new Hkdf_1.Hkdf('sha3-256');
        this.masterPrk = this.hkdf.extract(this.seed.data, KeyPrefixes_1.default.MasterKeySalt);
    }
    /**
     * Generates a new key pair at the number position.
     *
     */
    generateKey(childDepth) {
        // const childDepthBuffer = toBufferLE(BigInt(childDepth), 8)
        const childDepthBuffer = Buffer.from(BigInt(childDepth)
            .toString(16)
            .padStart(16, '0')
            .slice(0, 16), 'hex');
        childDepthBuffer.reverse();
        const info = Buffer.from([
            ...Uint8Array.from(Buffer.from(KeyPrefixes_1.default.DerivedKey)),
            ...Uint8Array.from(childDepthBuffer),
        ]);
        const secretKey = this.hkdf.expand(this.masterPrk, info, 32);
        return Eddsa_1.KeyPair.fromSecretKey(secretKey);
    }
}
exports.KeyFactory = KeyFactory;
