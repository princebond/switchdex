import { Step } from 'react-joyride';

const commonSteps: Step[] = [
    {
        target: '.markets-lists',
        content: 'Lists all markets listed in this dex',
        placementBeacon: 'top',
    },
    {
        target: '.market-details',
        content: 'Show all market details related to the selected pair and respective graphic',
        placementBeacon: 'top',
    },
    {
        target: '.wallet-balance',
        content: 'Shows your balances of current active pair',
        placementBeacon: 'top',
    },
    {
        target: '.buy-sell',
        content:
            'Buy or sell the current active pair with limit and market options. Market buy/sell will buy directly from orders on orderbook, market limit buy/sell will buy or sell at the fixed price, if no order with that value it will place a order.',
        placementBeacon: 'top',
    },
    {
        target: '.orderbook',
        content: 'Shows bid and asks for active current pair',
        placementBeacon: 'top',
    },
    {
        target: '.orderhistory',
        content: 'Shows your open orders for active current pair. You can check filled balance and cancel orders here.',
        placementBeacon: 'top',
    },
    {
        target: '.market-fills',
        content: 'Shows most recent market fills for the current active pair.',
        placementBeacon: 'top',
    },
    {
        target: '.order-fills',
        content: 'Shows all recent trades on 0x network for the listed pairs on this dex.',
        placementBeacon: 'top',
    },
];

export const marketPlaceSteps: Step[] = [
    {
        target: '.theme-switcher',
        content: 'Choose a theme between Light or Dark',
        placementBeacon: 'top',
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
    {
        target: '.buy-eth',
        content:
            'Buy ETH with Apple Pay, Credit or Debit Cards using our integrated fiat on ramps from our parterns: Wyre and Coindirect',
        placementBeacon: 'top',
    },
    {
        target: '.my-wallet',
        content:
            'Navigate to your Wallet. Here you can check all token balances, transfer tokens and buy tokens instantly',
        placementBeacon: 'top',
    },
    {
        target: '.wallet-dropdown',
        content:
            'Check the navigation menu. Here you can copy to clipboard, set alerts, check your etherscan wallet, go to launchpad or lend tokens at lending page',
        placementBeacon: 'top',
    },
    {
        target: '.markets-dropdown',
        content: 'Check all markets clicking on this dropdown',
        placementBeacon: 'top',
    },
    {
        target: '.notifications',
        content: 'Check all related blockchain notifications here from market buy, market sell and token transfers.',
        placementBeacon: 'top',
    },
];

const noLoginWallet: Step[] = [
    {
        target: '.connect-wallet',
        content: 'Connect Wallet to start use the platform clicking here',
        placementBeacon: 'top',
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
];

export const allSteps = marketPlaceSteps.concat(commonSteps);

export const noWalletSteps = noLoginWallet.concat(commonSteps);
