import { getLogger } from "../../util/logger";
import { ThunkCreator, SwapQuoteState } from "../../util/types";
import { CalculateSwapQuoteParams } from "../../util/types/swap";
import { getAssetSwapper } from "../../services/swap";
import { MarketSellSwapQuote, MarketBuySwapQuote } from "@0x/asset-swapper";
import { createAction } from "typesafe-actions";

const logger = getLogger('Store::Swap::Actions');

export const setSwapQuote = createAction('swap/QUOTE_set', resolve => {
    return (quote: MarketSellSwapQuote | MarketBuySwapQuote) => resolve(quote);
});

export const setSwapQuoteState = createAction('swap/QUOTE_STATE_set', resolve => {
    return (quoteState: SwapQuoteState) => resolve(quoteState);
});


export const calculateSwapQuote: ThunkCreator = (params: CalculateSwapQuoteParams) => {
    return async (dispatch, getState) => {
        const state = getState();
        dispatch(setSwapQuoteState(SwapQuoteState.Loading))
        try {
            const assetSwapper = await getAssetSwapper();
            const quote = await assetSwapper.getSwapQuote(params);
            console.log(quote);
            dispatch(setSwapQuote(quote));
            dispatch(setSwapQuoteState(SwapQuoteState.Done))
        } catch (err) {
            console.log(err);
            logger.error(`error fetching quote.`, err);
            dispatch(setSwapQuoteState(SwapQuoteState.Error))
            return err;
        }
    };
};