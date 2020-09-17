export default function (api, mod, func, cArgs) {
  if (mod === 'identity' && func === 'setIdentity') {
    const name = cArgs[0];
    cArgs = [ api.createType('IdentityInfo', {
      display: { raw: name },
      additional: []
    }) ];
  }

  return cArgs
}
