import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import styled from 'styled-components';

import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getFills, getQuoteToken, getUserOrders, getWeb3State, getCurrencyPair, getMarketFills, getCurrentMarketTodayHighPrice, getCurrentMarketTodayLowerPrice, getCurrentMarketTodayVolume, getCurrentMarketLastPrice, getCurrentMarketTodayClosedOrders } from '../../../store/selectors';
import { getCurrencyPairByTokensSymbol } from '../../../util/known_currency_pairs';
import { isWeth } from '../../../util/known_tokens';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, Fill, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';
import { BigNumber } from '0x.js';

const MarketDetailCard = styled(Card)`
    max-height: 400px;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    quoteToken: Token | null;
    web3State?: Web3State;
    currencyPair: CurrencyPair;
    highPrice: number | null;
    lowerPrice: number | null;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

const SideTD = styled(CustomTD) <{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;
const ClicableTD = styled(CustomTD)`
    cursor: pointer;
`;

interface MarketStats {
    highPrice: number | null;
    lowerPrice: number | null;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}



const statsToRow = (marketStats: MarketStats, baseToken: Token) => {
    
    return (
        <TR>
            <CustomTD >{baseToken.name}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {marketStats.lastPrice || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.highPrice || '-'}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.lowerPrice || '-'}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{ (marketStats.volume && marketStats.volume.toString()) || '-'}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {marketStats.closedOrders || '-'}
            </CustomTD>
        </TR>
    );
};

class MarketDetails extends React.Component<Props> {
    public render = () => {
        const { baseToken, quoteToken, web3State } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                } else {
                    const { highPrice, lowerPrice, volume, closedOrders, lastPrice } = this.props;
                    const marketStats = {
                        highPrice,
                        lowerPrice,
                        volume,
                        closedOrders,
                        lastPrice,
                    };
                    content = (
                        <Table isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH>Project</TH>
                                    <TH styles={{ textAlign: 'right' }}>Last Price</TH>
                                    <TH styles={{ textAlign: 'right' }}>Max Price 24H</TH>
                                    <TH styles={{ textAlign: 'right' }}>Min Price 24H</TH>
                                    <TH styles={{ textAlign: 'right' }}>Volume 24H</TH>
                                    <TH styles={{ textAlign: 'right' }}>Orders Closed</TH>
                                </TR>
                            </THead>
                            <tbody>{statsToRow(marketStats, baseToken)}</tbody>
                        </Table>
                    );
                }
                break;
            }
        }

        return <MarketDetailCard title="Market Stats">{content}</MarketDetailCard>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        orders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        highPrice: getCurrentMarketTodayHighPrice(state),
        lowerPrice: getCurrentMarketTodayLowerPrice(state),
        volume: getCurrentMarketTodayVolume(state),
        closedOrders: getCurrentMarketTodayClosedOrders(state),
        lastPrice: getCurrentMarketLastPrice(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketDetails);

export { MarketDetails, MarketDetailsContainer };