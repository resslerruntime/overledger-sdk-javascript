import OverledgerSDK from '@quantnetwork/overledger-core';

describe('Dlt', () => {
  test('Can construct the DLT', () => {
    const mappId = 'mockMappId';
    const bpiKey = 'mockBpiKey';
    const thisAddress = 'Alice123';
    const thisProvider = 'hlfProvider';
    const sdkOptions = {
      dlts: [
        { dlt: 'hyperledger_fabric' },
      ],
    };

    const sdk = new OverledgerSDK(mappId, bpiKey, sdkOptions);
    sdk.dlts.hyperledger_fabric.setAccount({address: thisAddress, provider: thisProvider});


    expect(sdk.dlts.hyperledger_fabric.name).toEqual('hyperledger_fabric');
    expect(sdk.dlts.hyperledger_fabric.account.address).toEqual(thisAddress);
  });
});
