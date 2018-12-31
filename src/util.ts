import { compactAddLength, stringToU8a } from "@polkadot/util";

export const stringToBytes = function (s: string) {
  return compactAddLength(stringToU8a(s));
}