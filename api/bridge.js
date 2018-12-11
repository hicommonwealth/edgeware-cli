export const deposit = async function (api, user, target, txHash, quantity) {
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.bridge.deposit(target, txHash, quantity);
    tx.sign(user, txNonce);
    const txHash = await tx.send();
    return txHash;
}

const export signDeposit = async function (api, user, target, txHash, quantity) {
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.bridge.sign_deposit(target, txHash, quantity);
    tx.sign(user, txNonce);
    const txHash = await tx.send();
    return txHash;
}

const export withdraw = async function (api, user, quantity, signedCrossChainTx) {
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.bridge.sign_deposit(quantity, signedCrossChainTx);
    tx.sign(user, txNonce);
    const txHash = await tx.send();
    return txHash;
}

const export signWithdraw = async function (api, user, target, recordHash, quantity, signedCrossChainTx) {
    const txNonce = await api.query.system.accountNonce(user.address());
    const tx = api.tx.bridge.sign_deposit(target, recordHash, quantity, signedCrossChainTx);
    tx.sign(user, txNonce);
    const txHash = await tx.send();
    return txHash;
}

export const getBlockHeaders = async function (nameHash) {
    return await api.query.bridgeStorage.block_headers(nameHash);
}

export const getAuthorities = async function () {
    return await api.query.bridgeStorage.authorities();
}

export const getDepositCount = async function () {
    return await api.query.bridgeStorage.deposit_count();
}

export const getDeposits = async function () {
    return await api.query.bridgeStorage.deposits();
}

export const getDepositByHash = async function (depositHash) {
    return await api.query.bridgeStorage.deposit_of(depositHash);
}

export const getWithdrawCount = async function () {
    return await api.query.bridgeStorage.withdraw_count();
}

export const getWithdraws = async function () {
    return await api.query.bridgeStorage.withdraws();
}

export const getWithdrawByHash = async function (withdrawHash) {
    return await api.query.bridgeStorage.withdraw_of(withdrawHash);
}

export const getWithdrawNonce = async function (user) {
    return await api.query.bridgeStorage.withdraw_nonce_of(user);
}
