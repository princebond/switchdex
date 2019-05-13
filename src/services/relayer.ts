import { assetDataUtils, BigNumber } from '0x.js';
import { HttpClient, SignedOrder } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';
import { Token } from '../util/types';

interface GetOrderRequestOpts {
    makerAssetData?: string;
    takerAssetData?: string;
    makerAddress?: string;
    makerAssetAddress?: string;
    takerAssetAddress?: string;
}

interface AllOrderOpts {
    baseTokenAssetData?: string;
    quoteTokenAssetData?: string;
    makerAssetAddress?: string;
    takerAssetAddress?: string;
}

export class Relayer {
    public readonly client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async getAllOrdersAsync({
        baseTokenAssetData,
        quoteTokenAssetData,
        makerAssetAddress,
        takerAssetAddress,
    }: AllOrderOpts): Promise<SignedOrder[]> {
        if (baseTokenAssetData && quoteTokenAssetData) {
            const [sellOrders, buyOrders] = await Promise.all([
                this._getOrdersAsync({
                    makerAssetData: baseTokenAssetData,
                    takerAssetData: quoteTokenAssetData,
                }),
                this._getOrdersAsync({
                    makerAssetData: quoteTokenAssetData,
                    takerAssetData: baseTokenAssetData,
                }),
            ]);
            return [...sellOrders, ...buyOrders];
        } else if (makerAssetAddress && takerAssetAddress) {
            return this._getOrdersAsync({
                makerAssetAddress,
                takerAssetAddress,
            });
        } else {
            return [];
        }
    }

    public async getUserOrdersAsync(
        account: string,
        baseTokenAssetData: string,
        quoteTokenAssetData: string,
    ): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync({
                makerAssetData: baseTokenAssetData,
                takerAssetData: quoteTokenAssetData,
                makerAddress: account,
            }),
            this._getOrdersAsync({
                makerAssetData: quoteTokenAssetData,
                takerAssetData: baseTokenAssetData,
                makerAddress: account,
            }),
        ]);

        return [...sellOrders, ...buyOrders];
    }

    public async getCurrencyPairPriceAsync(baseToken: Token, quoteToken: Token): Promise<BigNumber | null> {
        const { asks } = await this.client.getOrderbookAsync({
            baseAssetData: assetDataUtils.encodeERC20AssetData(baseToken.address),
            quoteAssetData: assetDataUtils.encodeERC20AssetData(quoteToken.address),
        });

        if (asks.records.length) {
            const lowestPriceAsk = asks.records[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk.order;

            return takerAssetAmount.div(makerAssetAmount);
        }

        return null;
    }

    private async _getOrdersAsync(requestOpts: GetOrderRequestOpts): Promise<SignedOrder[]> {
        let recordsToReturn: SignedOrder[] = [];

        let hasMorePages = true;
        let page = 1;

        while (hasMorePages) {
            const { total, records, perPage } = await this.client.getOrdersAsync({
                ...requestOpts,
                page,
            });

            const recordsMapped = records.map(apiOrder => {
                return apiOrder.order;
            });
            recordsToReturn = [...recordsToReturn, ...recordsMapped];

            page += 1;
            const lastPage = Math.ceil(total / perPage);
            hasMorePages = page <= lastPage;
        }
        return recordsToReturn;
    }
}

let relayer: Relayer;
export const getRelayer = (): Relayer => {
    if (!relayer) {
        const client = new HttpClient(RELAYER_URL);
        relayer = new Relayer(client);
    }

    return relayer;
};
