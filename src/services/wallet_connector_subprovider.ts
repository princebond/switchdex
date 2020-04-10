import { assert } from '@0x/assert';
import { Callback, ErrorCallback, Subprovider } from '@0x/subproviders';
import WalletConnect from '@walletconnect/browser';
import { JSONRPCRequestPayload } from 'ethereum-types';
import JsonRpcError from 'json-rpc-error';

/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It forwards on JSON RPC requests to the supplied `rpcUrl` endpoint
 */
export class WalletConnectSubprovider extends Subprovider {
    private readonly _walletConnector: WalletConnect;
    private readonly _requestTimeoutMs: number;
    /**
     * @param rpcUrl URL to the backing Ethereum node to which JSON RPC requests should be sent
     * @param requestTimeoutMs Amount of miliseconds to wait before timing out the JSON RPC request
     */
    constructor(walletConnector: WalletConnect, requestTimeoutMs: number = 20000) {
        super();
        assert.isNumber('requestTimeoutMs', requestTimeoutMs);
        this._walletConnector = walletConnector;
        this._requestTimeoutMs = requestTimeoutMs;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param _next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    public async handleRequest(payload: JSONRPCRequestPayload, _next: Callback, end: ErrorCallback): Promise<void> {
        const finalPayload = Subprovider._createFinalPayload(payload);
        let response;
      /*  if(
            finalPayload.method === 'eth_sendTransaction'
           || finalPayload.method === 'eth_signTypedData'
           || finalPayload.method === 'eth_sign'
           || finalPayload.method === 'personal_sign' ){
            try {
                response =  await this._walletConnector.sendCustomRequest(finalPayload);
                end(null, response);
            } catch (err) {
                end(new JsonRpcError.InternalError(err));
                return;
            }
        }*/
        try {
            response =  await this._walletConnector.sendCustomRequest(finalPayload);
            end(null, response);
        } catch (err) {
            end(new JsonRpcError.InternalError(err));
            return;
        }

        _next();
    }
   /**
    * This method conforms to the provider sendAsync interface.
    * Allowing the MetamaskSubprovider to be used as a generic provider (outside of Web3ProviderEngine) with the
    * addition of wrapping the inconsistent Metamask behaviour
    * @param payload JSON RPC payload
    * @return The contents nested under the result key of the response body
    */
    public sendAsync(payload: JSONRPCRequestPayload, callback: ErrorCallback): void {
        void this.handleRequest(
            payload,
            // handleRequest has decided to not handle this, so fall through to the provider
            () => {
               //
            },
            // handleRequest has called end and will handle this
            (err: any, data: any) => {
                err ? callback(err) : callback(null, { ...payload, result: data });
            },
        );
    }
}

