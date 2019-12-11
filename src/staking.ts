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
    if (Number(cArgs[0]) >= 10 ** 9) throw new Error('You are trying to send more than 1,000,000,000 EDG, staking units are in units of EDG')
    cArgs[0] = String((10 ** 18) * Number(cArgs[0]));
  }

  if (mod === 'staking' && func === 'bond') {
    if (Number(cArgs[1]) >= 10 ** 9) throw new Error('You are trying to send more than 1,000,000,000 EDG, staking units are in units of EDG')
    cArgs[1] = String((10 ** 18) * Number(cArgs[1]));
  }

  if (mod === 'staking' && func === 'bondExtra') {
    if (Number(cArgs[0]) >= 10 ** 9) throw new Error('You are trying to send more than 1,000,000,000 EDG, staking units are in units of EDG')
    cArgs[0] = String((10 ** 18) * Number(cArgs[0]));
  }

  return cArgs;
}