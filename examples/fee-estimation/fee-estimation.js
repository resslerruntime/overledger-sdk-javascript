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
            provider: { network: 'http://localhost:8088' , timeout: '1200000'},
        });

        let request = {
            dlt: "ripple",
            data: "0"
        }

        console.log("going to call fee estimation");
        const feeEstimationResponse = await overledger.getFeeEstimation(request.dlt, request.data);

        console.log("");
        console.log('feeEstimationResponse for dlt: ' + feeEstimationResponse.data.dlt + ", data:" + feeEstimationResponse.data.data);
        console.log("");
    } catch (e) {
        console.error('error', e);
        //console.error('error', e.response.data.errors);
    }
})();
