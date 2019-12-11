import Keyring from '@polkadot/keyring';

export default function (mod, func, cArgs) {
	if (mod === 'session' && func === 'setKeys') {
	  let keys;
	  if (cArgs[0].indexOf(',') !== -1) {
	    keys = cArgs[0].split(',').map(k => (new Keyring()).encodeAddress(k));
	  } else {
	    keys = cArgs[0];
	  }
	  
	  cArgs = [keys, '0x'];
	}

	return cArgs
}