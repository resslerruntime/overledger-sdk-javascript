import Dlt from '../src';
import OverledgerSDK from '@overledger/core';

describe('Dlt', () => {
  test('Can construct the Dlt with the index or dlt', () => {
    const mappId = 'mockMappId';
    const bpiKey = 'mockBpiKey';

    const options = {
      privateKey: 'cRgjFWSzDjdN2SqXUMiCQuQhf7c9bTLVsk5Kx9quL4bsn4iJEdu2',
    };
    const sdkOptions = {
      dlts: [
        { dlt: 'bitcoin', ...options },
      ],
    };

    const sdk = new OverledgerSDK(mappId, bpiKey, sdkOptions);
    const dlt = new Dlt(sdk, options);

    expect(sdk.dlts.bitcoin.name).toEqual(dlt.name);
    expect(sdk.dlts.bitcoin.account.address).toEqual(dlt.account.address);
  });
});
