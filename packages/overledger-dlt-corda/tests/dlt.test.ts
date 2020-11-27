import Dlt from '../src';
import OverledgerSDK from '@quantnetwork/overledger-core';

describe('Dlt', () => {
  test('Can construct the DLT', () => {
    const mappId = 'mockMappId';
    const bpiKey = 'mockBpiKey';
    const cordaNodeProvider = 'PartyA';
    const overledgerCorda = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: 'corda' }],
      provider: { network: 'mockCordaNetworkConnection' },
    });
    overledgerCorda.dlts.corda.setAccount({provider:cordaNodeProvider});


    expect(overledgerCorda.dlts.corda.name).toEqual('corda');
    expect(overledgerCorda.provider.network).toEqual('mockCordaNetworkConnection');
  });
});