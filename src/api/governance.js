"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var codec_1 = require("@polkadot/types/codec");
var util_crypto_1 = require("@polkadot/util-crypto");
var util_1 = require("@polkadot/util");
var Referendum = /** @class */ (function (_super) {
    __extends(Referendum, _super);
    function Referendum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Referendum;
}(types_1.Null));
var Funding = /** @class */ (function (_super) {
    __extends(Funding, _super);
    function Funding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Funding;
}(types_1.Null));
var NetworkChange = /** @class */ (function (_super) {
    __extends(NetworkChange, _super);
    function NetworkChange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NetworkChange;
}(types_1.Null));
var ProposalCategory = /** @class */ (function (_super) {
    __extends(ProposalCategory, _super);
    function ProposalCategory(value, index) {
        return _super.call(this, {
            Referendum: Referendum,
            Funding: Funding,
            NetworkChange: NetworkChange
        }, value, index) || this;
    }
    return ProposalCategory;
}(codec_1.EnumType));
var PreVoting = /** @class */ (function (_super) {
    __extends(PreVoting, _super);
    function PreVoting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreVoting;
}(types_1.Null));
var Voting = /** @class */ (function (_super) {
    __extends(Voting, _super);
    function Voting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Voting;
}(types_1.Null));
var Completed = /** @class */ (function (_super) {
    __extends(Completed, _super);
    function Completed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Completed;
}(types_1.Null));
var ProposalStage = /** @class */ (function (_super) {
    __extends(ProposalStage, _super);
    function ProposalStage(value, index) {
        return _super.call(this, {
            PreVoting: PreVoting,
            Voting: Voting,
            Completed: Completed
        }, value, index) || this;
    }
    return ProposalStage;
}(codec_1.EnumType));
var ProposalComment = /** @class */ (function (_super) {
    __extends(ProposalComment, _super);
    function ProposalComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProposalComment;
}(codec_1.Tuple["with"]([types_1.Text, types_1.AccountId])));
var ProposalRecord = /** @class */ (function (_super) {
    __extends(ProposalRecord, _super);
    function ProposalRecord(value) {
        return _super.call(this, {
            index: types_1.u32,
            author: types_1.AccountId,
            stage: ProposalStage,
            category: ProposalCategory,
            contents: types_1.Text,
            comments: codec_1.Vector["with"](ProposalComment)
        }, value) || this;
    }
    Object.defineProperty(ProposalRecord.prototype, "index", {
        get: function () {
            return this.get('index');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProposalRecord.prototype, "author", {
        get: function () {
            return this.get('author');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProposalRecord.prototype, "stage", {
        get: function () {
            return this.get('stage');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProposalRecord.prototype, "category", {
        get: function () {
            return this.get('category');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProposalRecord.prototype, "contents", {
        get: function () {
            return this.get('contents');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProposalRecord.prototype, "comments", {
        get: function () {
            return this.get('comments');
        },
        enumerable: true,
        configurable: true
    });
    return ProposalRecord;
}(codec_1.Struct));
exports.GovernanceTypes = {
    "ProposalCategory": ProposalCategory,
    "ProposalRecord": ProposalRecord
};
exports.createProposal = function (api, user, proposal, category) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, prop, propHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    prop = api.tx.governance.createProposal(proposal, category);
                    prop.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, prop.send()];
                case 2:
                    propHash = _a.sent();
                    console.log("Proposal " + proposal + " published with hash " + propHash);
                    return [2 /*return*/, propHash];
            }
        });
    });
};
exports.addComment = function (api, user, proposalHash, commentText) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, comment, commentHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    comment = api.tx.governance.addComment(proposalHash, commentText);
                    comment.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, comment.send()];
                case 2:
                    commentHash = _a.sent();
                    console.log("Common " + commentText + " published with hash " + commentHash);
                    return [2 /*return*/, commentHash];
            }
        });
    });
};
exports.vote = function (api, user, proposalHash, voteBool) {
    return __awaiter(this, void 0, void 0, function () {
        var txNonce, vote_tx, voteHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.system.accountNonce(user.address())];
                case 1:
                    txNonce = _a.sent();
                    if (!txNonce) {
                        return [2 /*return*/, new Error("Failed to get nonce!")];
                    }
                    vote_tx = api.tx.governance.vote(proposalHash, voteBool);
                    vote_tx.sign(user, txNonce.toU8a());
                    return [4 /*yield*/, vote_tx.send()];
                case 2:
                    voteHash = _a.sent();
                    console.log("Vote " + voteBool + " for proposal " + proposalHash + " published with hash " + voteHash);
                    return [2 /*return*/, voteHash];
            }
        });
    });
};
exports.getProposals = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.governanceStorage.proposals()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getProposalCount = function (api) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.governanceStorage.proposalCount()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getProposalByHash = function (api, proposalHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.query.governanceStorage.proposalOf(proposalHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getProposal = function (api, account, proposal) {
    return __awaiter(this, void 0, void 0, function () {
        var input, proposalHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = util_1.u8aConcat(account, proposal);
                    proposalHash = new types_1.Hash(util_crypto_1.blake2AsU8a(input));
                    return [4 /*yield*/, exports.getProposalByHash(api, proposalHash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
