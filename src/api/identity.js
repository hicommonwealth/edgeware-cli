"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var types_1 = require("@polkadot/types");
var util_crypto_1 = require("@polkadot/util-crypto");
exports.IdentityTypes = {
    "Claim": types_1.Bytes,
    "IdentityIndex": types_1.u32
};
exports.link = function (api, user, identity, proof) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, identityHash, link, linkHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    identityHash = util_crypto_1.blake2AsU8a(identity);
                    link = api.tx.identity.link(identityHash, proof);
                    link.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, link.send()];
                case 2:
                    linkHash = _a.sent();
                    console.log("Identity " + identity + " published with hash " + linkHash);
                    return [2 /*return*/, linkHash];
            }
        });
    });
};
exports.publish = function (api, user, identity) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, identityHash, publish, pubHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    identityHash = util_crypto_1.blake2AsU8a(identity);
                    publish = api.tx.identity.publish(identityHash);
                    publish.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, publish.send()];
                case 2:
                    pubHash = _a.sent();
                    console.log("Identity " + identity + " published with hash " + pubHash);
                    return [2 /*return*/, pubHash];
            }
        });
    });
};
exports.getAllIdentities = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.identities()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getIdentity = function (api, identity) {
    return __awaiter(this, void 0, void 0, function () {
        var identityHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identityHash = util_crypto_1.blake2AsU8a(identity);
                    return [4 /*yield*/, api.query.identityStorage.identity_of(identityHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getIdentityByHash = function (api, identityHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.identity_of(identityHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getIdentityCount = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.identityCount()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getLinkedIdentityCount = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.linkedIdentityCount()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getClaim = function (api, claimHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.claims(claimHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getClaimsIssuers = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.identityStorage.claimsIssuers()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
