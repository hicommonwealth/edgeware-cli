import stakingArgSwitcher from './staking';
import sessionArgSwitcher from './session';

export default function (mod, func, cArgs) {
  cArgs = stakingArgSwitcher(mod, func, cArgs);
  cArgs = sessionArgSwitcher(mod, func, cArgs);
  return cArgs;
}