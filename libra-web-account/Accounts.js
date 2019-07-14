"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("../lib/bignumber.js"));
const sha3_1 = require("../lib/sha3");
const CursorBuffer_1 = require("../libra-web-core-utils/common/CursorBuffer");
const Addresses_1 = __importDefault(require("../libra-web-core-utils/constants/Addresses"));
const Eddsa_1 = require("../libra-web-core-utils/crypto/Eddsa");
/**
 * Contains all the information relevant to a particular users accounts.
 * Beware of stale data though. Will implement refresh logic soon.
 *
 *
 */
class AccountState {
    /**
     * Returns an empty AccountState
     */
    static default(address) {
        return new AccountState(Uint8Array.from(address.toBytes()), new bignumber_js_1.default(0), new bignumber_js_1.default(0), new bignumber_js_1.default(0), new bignumber_js_1.default(0));
    }
    static from(bytes) {
        const cursor = new CursorBuffer_1.CursorBuffer(bytes);
        const authenticationKeyLen = cursor.read32();
        const authenticationKey = cursor.readXBytes(authenticationKeyLen);
        const balance = cursor.read64();
        const receivedEventsCount = cursor.read64();
        const sentEventsCount = cursor.read64();
        const sequenceNumber = cursor.read64();
        return new AccountState(authenticationKey, balance, receivedEventsCount, sentEventsCount, sequenceNumber);
    }
    constructor(authenticationKey, balance, receivedEventsCount, sentEventsCount, sequenceNumber) {
        this.balance = balance;
        this.sequenceNumber = sequenceNumber;
        this.authenticationKey = authenticationKey;
        this.sentEventsCount = sentEventsCount;
        this.receivedEventsCount = receivedEventsCount;
    }
}
exports.AccountState = AccountState;
class Account {
    static fromSecretKeyBytes(secretKeyBytes) {
        return new Account(Eddsa_1.KeyPair.fromSecretKey(secretKeyBytes));
    }
    static fromSecretKey(secretKeyHex) {
        const keyBytes = new Uint8Array(Buffer.from(secretKeyHex, 'hex'));
        return Account.fromSecretKeyBytes(keyBytes);
    }
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
    getAddress() {
        if (this.address !== undefined) {
            return this.address;
        }
        const sha3 = new sha3_1.SHA3(256);
        sha3.update(Buffer.from(this.keyPair.getPublicKey()));
        this.address = new AccountAddress(new Uint8Array(sha3.digest()));
        return this.address;
    }
    generateSignature(message) {
        return this.keyPair.sign(message);
    }
    getSecretKey() {
        return this.keyPair.getSecretKey();
    }
    getPublicKey() {
        return this.keyPair.getPublicKey();
    }
}
exports.Account = Account;
/**
 * Represents a validated Account address
 *
 */
class AccountAddress {
    static isValidString(addressHex) {
        const length = String(addressHex).replace(' ', '').length;
        return length === Addresses_1.default.AddressLength * 2;
    }
    static isValidBytes(addressBytes) {
        return addressBytes.length === Addresses_1.default.AddressLength;
    }
    static default() {
        return new AccountAddress(new Uint8Array(Addresses_1.default.AddressLength));
    }
    static fromHex(addressHex) {
        return new AccountAddress(Uint8Array.from(Buffer.from(addressHex, 'hex')));
    }
    constructor(hash) {
        if (!AccountAddress.isValidBytes(hash)) {
            throw new Error(`The address is of invalid length [${hash.length}]`);
        }
        this.addressBytes = hash.slice(0, Addresses_1.default.AddressLength);
    }
    isDefault() {
        return AccountAddress.default().toHex() === this.toHex();
    }
    toBytes() {
        return this.addressBytes;
    }
    toHex() {
        return Buffer.from(this.addressBytes).toString('hex');
    }
    /**
     * Alias for toHex()
     */
    toString() {
        return this.toHex();
    }
}
exports.AccountAddress = AccountAddress;
