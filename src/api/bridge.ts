import { ApiPromise } from "@polkadot/api";
import { Hash, AccountId, Balance, Bytes } from "@polkadot/types";
import { KeyringPair } from "@polkadot/keyring/types";

export const deposit = async function (api: ApiPromise, user: KeyringPair, target: AccountId, txHash: Hash, quantity: Balance) {
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        console.log("Failed to get nonce!");
        return null;
    }

    const tx = api.tx.bridge.deposit(target, txHash, quantity);
    tx.sign(user, txNonce.toU8a());
    const resultHash = await tx.send();
    return resultHash;
}

export const signDeposit = async function (api: ApiPromise, user: KeyringPair, target: AccountId, txHash: Hash, quantity: Balance) {
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        console.log("Failed to get nonce!");
        return null;
    }

    const tx = api.tx.bridge.sign_deposit(target, txHash, quantity);
    tx.sign(user, txNonce.toU8a());
    const resultHash = await tx.send();
    return resultHash;
}

export const withdraw = async function (api: ApiPromise, user: KeyringPair, quantity: Balance, signedCrossChainTx: Bytes) {
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        console.log("Failed to get nonce!");
        return null;
    }

    const tx = api.tx.bridge.sign_deposit(quantity, signedCrossChainTx);
    tx.sign(user, txNonce.toU8a());
    const resultHash = await tx.send();
    return resultHash;
}

export const signWithdraw = async function (api: ApiPromise, user: KeyringPair, target: AccountId, recordHash: Hash, quantity: Balance, signedCrossChainTx: Bytes) {
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        console.log("Failed to get nonce!");
        return null;
    }

    const tx = api.tx.bridge.sign_deposit(target, recordHash, quantity, signedCrossChainTx);
    tx.sign(user, txNonce.toU8a());
    const resultHash = await tx.send();
    return resultHash;
}

export const getBlockHeaders = async function (api: ApiPromise, nameHash: Hash) {
    return await api.query.bridgeStorage.blockHeaders(nameHash);
}

export const getAuthorities = async function (api: ApiPromise) {
    return await api.query.bridgeStorage.authorities();
}

export const getDepositCount = async function (api: ApiPromise) {
    return await api.query.bridgeStorage.depositCount();
}

export const getDeposits = async function (api: ApiPromise) {
    return await api.query.bridgeStorage.deposits();
}

export const getDepositByHash = async function (api: ApiPromise, depositHash: Hash) {
    return await api.query.bridgeStorage.depositOf(depositHash);
}

export const getWithdrawCount = async function (api: ApiPromise) {
    return await api.query.bridgeStorage.withdrawCount();
}

export const getWithdraws = async function (api: ApiPromise) {
    return await api.query.bridgeStorage.withdraws();
}

export const getWithdrawByHash = async function (api: ApiPromise, withdrawHash: Hash) {
    return await api.query.bridgeStorage.withdrawOf(withdrawHash);
}

export const getWithdrawNonce = async function (api: ApiPromise, account: AccountId) {
    return await api.query.bridgeStorage.withdrawNonceOf(account);
}
