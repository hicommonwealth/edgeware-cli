import stakingArgSwitcher from './staking';
import sessionArgSwitcher from './session';
import identityArgSwitcher from './identity';

export default function (api, mod, func, cArgs) {
  cArgs = stakingArgSwitcher(mod, func, cArgs);
  cArgs = sessionArgSwitcher(mod, func, cArgs);
  cArgs = identityArgSwitcher(api, mod, func, cArgs);
  return cArgs;
}
