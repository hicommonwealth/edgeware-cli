import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { AccountId } from "@polkadot/types";

export const delegateTo = async function (api: ApiPromise, user: KeyringPair, to: AccountId) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        return new Error("Failed to get nonce!");
    }

    const tx = api.tx.delegation.delegate_to(to);
    tx.sign(user, txNonce.toU8a());
    const pubHash = await tx.send();
    console.log(`Delegation from ${user} to ${to} with hash ${pubHash}`);
    return pubHash;
}

export const undelegateFrom = async function (api: ApiPromise, user: KeyringPair, from: AccountId) {
    // Retrieve the nonce for the user, to be used to sign the transaction
    const txNonce = await api.query.system.accountNonce(user.address());
    if (!txNonce) {
        return new Error("Failed to get nonce!");
    }

    const tx = api.tx.delegation.undelegate_from(from);
    tx.sign(user, txNonce.toU8a());
    const pubHash = await tx.send();
    console.log(`Un-delegation back to ${user} from ${from} with hash ${pubHash}`);
    return pubHash;
}

export const getDelegation = async function (api: ApiPromise, user: AccountId) {
  return await api.query.delegationStorage.delegateOf(user);
}
