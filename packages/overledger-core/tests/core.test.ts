import OverledgerSDK from '../src';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Core', () => {
  const mappId = 'mockMappId';
  const bpiKey = 'mockBpiKey';
  let sdk;
  beforeAll(() => {
    const sdkOptions = {
      dlts: [
        { dlt: 'ethereum' },
        { dlt: 'ripple' },
        { dlt: 'bitcoin' }
      ],
    };

    sdk = new OverledgerSDK(mappId, bpiKey, sdkOptions);
  });

  test('Should not be able to initialize the connector with a wrong DLT name', () => {
    const mappId = 'mockMappId';
    const bpiKey = 'mockBpiKey';

    const sdkOptions = {
      dlts: [
        { dlt: 'wrongdltname' },
      ],
    };

    try {
      new OverledgerSDK(mappId, bpiKey, sdkOptions);
    } catch (e) {
      console.log(e);
      expect(e).toEqual('Could not find the package for this DLT. Please install @quantnetwork/overledger-dlt-wrongdltname manually.');
    }
  });

  test('getMappId()', () => {
    expect(sdk.getMappId()).toEqual(mappId);
  });


  test('setMappId()', () => {
    const newMappId = 'test';
    sdk.setMappId(newMappId);
    expect(sdk.getMappId()).toEqual(newMappId);
  });


  test('getBpiKey()', () => {
    const newBpiKey = 'test';
    sdk.setBpiKey(newBpiKey);
    expect(sdk.getBpiKey()).toEqual(newBpiKey);
  });

  test('subscribe update for a request', async () => {
    const request = {
      mappId: "myappId1",
      callbackUrl: "http://localhost:8086/webhook/dummyGet",
      timestamp: "2020-07-15T12:40:07.203809Z",
      overledgerTransactionId: "39c1607d-e546-41e6-b0d7-ce3108784daf"
  } 

  mockedAxios.post.mockResolvedValue([
    {
      payload: "Subscribed, application subscription: "+ request.mappId
                +", overledgerTransactionId: " + request.overledgerTransactionId
                +", webHookMessage: WebHookMessage(id=5f157e8a91d6b56ee02dc44e,"
                +", createdAt=2020-07-20T11:22:50.133713Z,"
                +", messageContent=UpdateMessage(overledgerTransactionId="+request.overledgerTransactionId+", timestamp=2020-07-20T11:22:49.944886Z, dltData=null), attempts=1, successSend=true, transactionId=43451e46-b2ac-11e9-a2a3-2a2ae2dbcce4, mappId="+request.mappId+")",
      headers: {
          id: "e7d738ef-ef65-8bf2-bbf7-f38b353ac3ca",
          timestamp: 1595244170359
      }
  }
  ] as any);

    await sdk.subscribeStatusUpdate(request);
    expect(mockedAxios.post).toBeCalledWith('/webhook/subscribe', JSON.stringify(request));
  });

  test('unSubscribe update for a request', async () => {
    const request = {
      mappId: "myappId1",
      callbackUrl: "http://localhost:8086/webhook/dummyGet",
      timestamp: "2020-07-15T12:40:07.203809Z",
      overledgerTransactionId: "39c1607d-e546-41e6-b0d7-ce3108784daf"
  } 

  mockedAxios.post.mockResolvedValue([
    {
      payload: "Unsubscribed, application subscription: " 
                +request.mappId+", "+request.overledgerTransactionId+"",
      headers: {
          id: "e7d738ef-ef65-8bf2-bbf7-f38b353ac3ca",
          timestamp: 1595244170359
      }
  }
  ] as any);

    await sdk.unSubscribeStatusUpdate(request);
    expect(mockedAxios.post).toBeCalledWith('/webhook/unsubscribe', JSON.stringify(request));
  });

  test('unable to subscribe for, it may be invalid.', async () => {
    const request = {
      mappId: "myappId1",
      callbackUrl: "http://localhost:8086/webhook/dummyGet",
      timestamp: "2020-07-15T12:40:07.203809Z",
      overledgerTransactionId: "39c1607d-e546-41e6-b0d7-ce3108784daf"
    }

    mockedAxios.post.mockResolvedValue([
      {
        errors: [
          {
            service: "BPI Webhook Service",
            code: 400,
            timestamp: 1595246685356,
            message: "Unable to subscribe " + request.overledgerTransactionId + ", it may be invalid.",
            details: "uri=/webhook/subscribe"
          }
        ],
        errorCount: 1
      }
    ] as any);

    await sdk.subscribeStatusUpdate(request);
    expect(mockedAxios.post).toBeCalledWith('/webhook/subscribe', JSON.stringify(request));
  });

  test('unable to unSubscribe for, it may be invalid.', async () => {
    const request = {
      mappId: "myappId1",
      callbackUrl: "http://localhost:8086/webhook/dummyGet",
      timestamp: "2020-07-15T12:40:07.203809Z",
      overledgerTransactionId: "39c1607d-e546-41e6-b0d7-ce3108784daf"
    }

    mockedAxios.post.mockResolvedValue([
      {
        errors: [
          {
            service: "BPI Webhook Service",
            code: 400,
            timestamp: 1595246685356,
            message: "Unable to subscribe " + request.overledgerTransactionId + ", it may be invalid.",
            details: "uri=/webhook/subscribe"
          }
        ],
        errorCount: 1
      }
    ] as any);

    await sdk.unSubscribeStatusUpdate(request);
    expect(mockedAxios.post).toBeCalledWith('/webhook/unsubscribe', JSON.stringify(request));
  });
});
