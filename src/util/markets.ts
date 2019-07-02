import { CurrencyPair, Market, Token } from './types';


export const filterMarketsByTokenSymbol = (markets: Market[], tokenSymbol: string): Market[] => {
    return markets.filter(
        market => market.currencyPair.base === tokenSymbol || market.currencyPair.quote === tokenSymbol,
    );
};

export const filterMarketsByString = (markets: Market[], str: string): Market[] => {
    return markets.filter(market => {
        const baseLowerCase = market.currencyPair.base.toLowerCase();
        const quoteLowerCase = market.currencyPair.quote.toLowerCase();
        return `${baseLowerCase}/${quoteLowerCase}`.indexOf(str.toLowerCase()) !== -1;
    });
};
/**
 * Export current market as string
 */
export const marketToString = (currencyPair: CurrencyPair): string => {
    return `${currencyPair.base.toUpperCase()}-${currencyPair.quote.toUpperCase()}`;
};

/**
 * Export current market as string
 */
export const marketToStringFromTokens = (base: Token, quote: Token): string => {
    return `${base.symbol.toUpperCase()}-${quote.symbol.toUpperCase()}`;
};
