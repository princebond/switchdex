import { SwapState, SwapQuoteState } from "../../util/types";
import { getKnownTokens } from "../../util/known_tokens";
import { RootAction } from "../reducers";
import * as actions from '../actions';
import { getType } from "typesafe-actions";

const know_tokens = getKnownTokens();

const initialSwapState: SwapState = {
    baseToken: know_tokens.getTokens()[6],
    quoteToken: know_tokens.getWethToken(),
    quote: undefined,
    quoteState: SwapQuoteState.NotLoaded,
};

export function swap(state: SwapState = initialSwapState, action: RootAction): SwapState {
    switch (action.type) {
        case getType(actions.setSwapQuote):
            return { ...state, quote: action.payload };
        case getType(actions.setSwapQuoteState):
            return { ...state,  quoteState: action.payload };
        default:
            return state;
    }
}