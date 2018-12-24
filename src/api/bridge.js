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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.deposit = function (api, user, target, txHash, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, tx, resultHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    tx = api.tx.bridge.deposit(target, txHash, quantity);
                    tx.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, tx.send()];
                case 2:
                    resultHash = _a.sent();
                    return [2 /*return*/, resultHash];
            }
        });
    });
};
exports.signDeposit = function (api, user, target, txHash, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, tx, resultHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    tx = api.tx.bridge.sign_deposit(target, txHash, quantity);
                    tx.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, tx.send()];
                case 2:
                    resultHash = _a.sent();
                    return [2 /*return*/, resultHash];
            }
        });
    });
};
exports.withdraw = function (api, user, quantity, signedCrossChainTx) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, tx, resultHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    tx = api.tx.bridge.sign_deposit(quantity, signedCrossChainTx);
                    tx.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, tx.send()];
                case 2:
                    resultHash = _a.sent();
                    return [2 /*return*/, resultHash];
            }
        });
    });
};
exports.signWithdraw = function (api, user, target, recordHash, quantity, signedCrossChainTx) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, tx, resultHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    tx = api.tx.bridge.sign_deposit(target, recordHash, quantity, signedCrossChainTx);
                    tx.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, tx.send()];
                case 2:
                    resultHash = _a.sent();
                    return [2 /*return*/, resultHash];
            }
        });
    });
};
exports.getBlockHeaders = function (api, nameHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.blockHeaders(nameHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getAuthorities = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.authorities()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getDepositCount = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.depositCount()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getDeposits = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.deposits()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getDepositByHash = function (api, depositHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.depositOf(depositHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getWithdrawCount = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.withdrawCount()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getWithdraws = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.withdraws()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getWithdrawByHash = function (api, withdrawHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.withdrawOf(withdrawHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getWithdrawNonce = function (api, account) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.bridgeStorage.withdrawNonceOf(account)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
