const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

const mappId = '...';
const bpiKey = '...';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.BITCOIN }, { dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP_LEDGER }],
            provider: { network: 'testnet' , timeout: '1200000'},
        });

        let request = {
            mappId: "myappId1",
            callbackUrl: "http://localhost:8086/webhook/dummyGet",
            timestamp: "2020-07-15T12:40:07.203809Z",
            overledgerTransactionId: "39c1607d-e546-41e6-b0d7-ce3108784daf"
        } 

    
        const subscribeStatusUpdate = await overledger.subscribeStatusUpdate(request.data);

        console.log("");
        console.log('subscribeStatusUpdate: ', subscribeStatusUpdate.data);
        console.log("");
    } catch (e) {
        console.error('error', e.response.data.errors);
    }
})();
