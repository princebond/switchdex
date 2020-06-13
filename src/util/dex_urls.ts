import { getKnownTokens } from "./known_tokens";

export const generateTrustWalletDeepLink = (url: string) => {
    return `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(url)}`;
};

export const generateMetamaskWalletDeepLink = (url: string) => {
    return `https://metamask.app.link/dapp/${url}`;
};

export const generateInstantLink = (address: string) => {
    const knownTokens = getKnownTokens();
    try{
        const token = knownTokens.getTokenByAddress(address);
        return `https://switchdex.ag/#/instant?token=${token.symbol}`;
    }catch{
        return `https://switchdex.ag/#/instant?token=${address}`;
    }
};

export const generateIEOInstantLink = (address: string, makerAddress: string) => {
    return `https://switchdex.ag/#/instant?token=${address}&makerAddress=${makerAddress}&isEIO=true`;
};

export const generateIEODashboardLink = (address: string, makerAddress: string) => {
    return `https://switchdex.ag/#/launchpad/orders?token=${address}&makerAddress=${makerAddress}&isEIO=true`;
};

export const generateERC20TradeLink = (address: string) => {
    const knownTokens = getKnownTokens();
    try{
        const token = knownTokens.getTokenByAddress(address);
        return `https://switchdex.ag/#/erc20?base=${token.symbol}&quote=weth`;
    }catch{
        return `https://switchdex.ag/#/erc20?base=${address}&quote=weth`;
    }  
};

export const generateERC20MarketTradeLink = (address: string) => {
    const knownTokens = getKnownTokens();
    try{
        const token = knownTokens.getTokenByAddress(address);
        return `https://switchdex.ag/#/market-trade?token=${token.symbol}`;
    }catch{
        return `https://switchdex.ag/#/market-trade?token=${address}`;
    }  
};
