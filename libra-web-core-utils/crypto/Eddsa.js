"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elliptic_1 = require("../../lib/elliptic");
class KeyPair {
    static fromSecretKey(secretKey) {
        const eddsa = new elliptic_1.eddsa('ed25519');
        const eddsaPair = eddsa.keyFromSecret(Buffer.from(secretKey));
        return new KeyPair(eddsaPair);
    }
    constructor(eddsaPair) {
        this.eddsaPair = eddsaPair;
    }
    sign(message) {
        const signatureBuffer = this.eddsaPair.sign(Buffer.from(message)).toBytes();
        return new Uint8Array(signatureBuffer);
    }
    verify(message, signature) {
        return this.eddsaPair.verify(Buffer.from(message), Buffer.from(signature));
    }
    getSecretKey() {
        return new Uint8Array(this.eddsaPair.getSecret());
    }
    getPublicKey() {
        return new Uint8Array(this.eddsaPair.getPublic());
    }
}
exports.KeyPair = KeyPair;
