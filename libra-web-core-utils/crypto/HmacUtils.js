"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha3_1 = require("../../lib/js-sha3");
class HmacUtils {
    static digestSha3256Hmac(key, data) {
        const blockSize = 136;
        const ipad = Buffer.allocUnsafe(blockSize);
        const opad = Buffer.allocUnsafe(blockSize);
        if (key.length > blockSize) {
            key = Buffer.from(js_sha3_1.sha3_256.create().update(key).digest());
        }
        else if (key.length < blockSize) {
            key = Buffer.concat([key, Buffer.alloc(128)], blockSize);
        }
        for (let i = 0; i < blockSize; i++) {
            /* tslint:disable */
            ipad[i] = key[i] ^ 0x36;
            opad[i] = key[i] ^ 0x5C;
            /* tslint:disable */
        }
        return js_sha3_1.sha3_256.create()
            .update(opad)
            .update(js_sha3_1.sha3_256.create()
            .update(ipad)
            .update(data)
            .digest())
            .digest();
    }
}
exports.HmacUtils = HmacUtils;
