import Dlt from '../src';
import OverledgerSDK from '@quantnetwork/overledger-core';

describe('Dlt', () => {
  test('Can construct the DLT', () => {
    const mappId = 'mockMappId';
    const bpiKey = 'mockBpiKey';
    const mockPrivateKey = 'cRgjFWSzDjdN2SqXUMiCQuQhf7c9bTLVsk5Kx9quL4bsn4iJEdu2';

    const sdkOptions = {
      dlts: [
        { dlt: 'bitcoin' },
      ],
    };

    const sdk = new OverledgerSDK(mappId, bpiKey, sdkOptions);
    sdk.dlts.bitcoin.setAccount({privateKey: mockPrivateKey});
    expect(sdk.dlts.bitcoin.name).toEqual('bitcoin');
    expect(sdk.dlts.bitcoin.account.privateKey).toEqual(mockPrivateKey);
  });
});