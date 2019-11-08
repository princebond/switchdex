import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { assetDataUtils, AssetProxyId } from '@0x/order-utils';
import { Orderbook } from '@0x/orderbook';
import { BigNumber } from '@0x/utils';
import { RateLimit } from 'async-sema';

import { NETWORK_ID, RELAYER_RPS, RELAYER_URL, RELAYER_WS_URL } from '../common/constants';
import { tokenAmountInUnitsToBigNumber } from '../util/tokens';
import { AccountMarketStat, MarketData, Token } from '../util/types';

export class Relayer {
    private readonly _client: HttpClient;
    private readonly _rateLimit: () => Promise<void>;
    private readonly _orderbook: Orderbook;

    constructor(options: { rps: number }) {
        this._orderbook = Orderbook.getOrderbookForWebsocketProvider({
            httpEndpoint: RELAYER_URL,
            networkId: NETWORK_ID,
            websocketEndpoint: RELAYER_WS_URL,
        });
        this._client = new HttpClient(RELAYER_URL);
        this._rateLimit = RateLimit(options.rps); // requests per second
    }

    public async getAllOrdersAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
        ]);
        return [...sellOrders, ...buyOrders];
    }

    public async getOrderConfigAsync(orderConfig: OrderConfigRequest): Promise<OrderConfigResponse> {
        await this._rateLimit();
        return this._client.getOrderConfigAsync(orderConfig);
    }

    public async getUserOrdersAsync(
        account: string,
        baseTokenAssetData: string,
        quoteTokenAssetData: string,
    ): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData, account),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData, account),
        ]);

        return [...sellOrders, ...buyOrders];
    }

    public async getCurrencyPairPriceAsync(baseToken: Token, quoteToken: Token): Promise<BigNumber | null> {
        const asks = await this._getOrdersAsync(
            assetDataUtils.encodeERC20AssetData(baseToken.address),
            assetDataUtils.encodeERC20AssetData(quoteToken.address),
        );

        if (asks.length) {
            const lowestPriceAsk = asks[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            return takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        return null;
    }

    public async getCurrencyPairMarketDataAsync(baseToken: Token, quoteToken: Token): Promise<MarketData> {
        await this._rateLimit();
        const { asks, bids } = await this._client.getOrderbookAsync({
            baseAssetData: assetDataUtils.encodeERC20AssetData(baseToken.address),
            quoteAssetData: assetDataUtils.encodeERC20AssetData(quoteToken.address),
        });
        const marketData: MarketData = {
            bestAsk: null,
            bestBid: null,
            spreadInPercentage: null,
        };

        if (asks.records.length) {
            const lowestPriceAsk = asks.records[0];
            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk.order;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            marketData.bestAsk = takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        if (bids.records.length) {
            const lowestPriceBid = bids.records[0];
            const { makerAssetAmount, takerAssetAmount } = lowestPriceBid.order;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, baseToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, quoteToken.decimals);
            marketData.bestBid = makerAssetAmountInUnits.div(takerAssetAmountInUnits);
        }
        if (marketData.bestAsk && marketData.bestBid) {
            const spread = marketData.bestAsk.minus(marketData.bestBid).dividedBy(marketData.bestAsk);
            marketData.spreadInPercentage = spread.multipliedBy(100);
        }

        return marketData;
    }

    public async getSellCollectibleOrdersAsync(
        collectibleAddress: string,
        wethAddress: string,
    ): Promise<SignedOrder[]> {
        await this._rateLimit();
        const result = await this._client.getOrdersAsync({
            makerAssetProxyId: AssetProxyId.ERC721,
            takerAssetProxyId: AssetProxyId.ERC20,
            makerAssetAddress: collectibleAddress,
            takerAssetAddress: wethAddress,
        });

        return result.records.map(record => record.order);
    }

    public async submitOrderAsync(order: SignedOrder): Promise<void> {
        await this._rateLimit();
        return this._client.submitOrderAsync(order);
    }

    private async _getOrdersAsync(
        makerAssetData: string,
        takerAssetData: string,
        makerAddress?: string,
    ): Promise<SignedOrder[]> {
        const apiOrders = await this._orderbook.getOrdersAsync(makerAssetData, takerAssetData);
        const orders = apiOrders.map(o => o.order);
        if (makerAddress) {
            return orders.filter(o => o.makerAddress === makerAddress);
        } else {
            return orders;
        }
    }
}

let relayer: Relayer;
export const getRelayer = (): Relayer => {
    if (!relayer) {
        relayer = new Relayer({ rps: RELAYER_RPS });
    }

    return relayer;
};

export const getAccountMarketStatsFromRelayer = async (
    pair: string,
    from: number,
    to: number,
): Promise<AccountMarketStat[]> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    const response = await fetch(`${RELAYER_URL}/markets/${pair}/accounts/stats?from=${from}&to=${to}`, init);
    if (response.ok) {
        return (await response.json()) as AccountMarketStat[];
    } else {
        return [];
    }
};
