import BN from 'bn.js';

export default function (mod, func, cArgs) {
  if (mod === 'staking' && func === 'validate') {
    let commission = Number(cArgs[0]);
    if (commission <= 100 && commission >= 0) {
      commission = Math.round(1000000000 * (commission * 1.0 / 100));
    } else {
      throw new Error('Arg must be a percentage value between 0 and 100');
    }
    cArgs = [{
      commission: new BN(commission),
    }];
  }

  if (mod === 'staking' && func === 'unbond') {
    cArgs[0] = String((10 ** 18) * Number(cArgs[0]));
  }

  if (mod === 'staking' && func === 'bond') {
    cArgs[1] = String((10 ** 18) * Number(cArgs[1]));
  }

  if (mod === 'staking' && func === 'bondExtra') {
    cArgs[0] = String((10 ** 18) * Number(cArgs[0]));
  }

  return cArgs;
}