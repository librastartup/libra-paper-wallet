"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Accounts_1 = require("./Accounts");
const KeyFactory_1 = require("./KeyFactory");
const Mnemonic_1 = require("./Mnemonic");
class LibraWallet {
    static create() {
        return new LibraWallet(new Mnemonic_1.Mnemonic().toString());
    }
    constructor(mnemonic) {
        if (!mnemonic) {
            throw new Error('Mnemonic is required for initialing LibraWallet. Use LibraWallet.create() for creating a new one.');
        }
        this.mnemonic = mnemonic.trim().split(' ');
        const seed = KeyFactory_1.Seed.fromMnemonic(this.mnemonic, 'LIBRA');
        this.keyFactory = new KeyFactory_1.KeyFactory(seed);
    }
    getAccount(depth = 0) {
        if (isNaN(depth)) {
            throw new Error(`LibraWallet depth [${depth}] must be a number`);
        }
        const account = new Accounts_1.Account(this.keyFactory.generateKey(depth));
        return account;
    }
    getMnemonic() {
        return this.mnemonic;
    }
}
exports.LibraWallet = LibraWallet;
exports.default = LibraWallet;
