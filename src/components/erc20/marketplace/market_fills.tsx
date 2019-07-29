import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import styled from 'styled-components';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE, UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../../common/constants';
import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getMarketFills, getQuoteToken, getUserOrders, getWeb3State } from '../../../store/selectors';
import { isWeth } from '../../../util/known_tokens';
import { marketToStringFromTokens } from '../../../util/markets';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, Fill, MarketFill, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const MarketTradesList = styled(Card)`
    max-height: 200px;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    quoteToken: Token | null;
    web3State?: Web3State;
    marketFills: MarketFill;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;

const fillToRow = (fill: Fill, index: number) => {
    const sideLabel = fill.side === OrderSide.Sell ? 'Sell' : 'Buy';
    const amountBase = tokenAmountInUnits(fill.amountBase, fill.tokenBase.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
    const displayAmountBase = `${amountBase} ${fill.tokenBase.symbol.toUpperCase()}`;
    const amountQuote = tokenAmountInUnits(fill.amountQuote, fill.tokenQuote.decimals, 3);
    const tokenQuoteSymbol = isWeth(fill.tokenQuote.symbol) ? 'ETH' : fill.tokenQuote.symbol.toUpperCase();
    const displayAmountQuote = `${amountQuote} ${tokenQuoteSymbol}`;
    const price = parseFloat(fill.price.toString()).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);

    return (
        <TR key={index}>
            <SideTD side={fill.side}>{sideLabel}</SideTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{price}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountBase}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountQuote}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                <TimeAgo date={fill.timestamp} />;
            </CustomTD>
        </TR>
    );
};

class MarketFills extends React.Component<Props> {
    public render = () => {
        const { marketFills, baseToken, quoteToken, web3State } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!Object.keys(marketFills).length || !baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                } else if (!marketFills[marketToStringFromTokens(baseToken, quoteToken)]) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                } else {
                    const market = marketToStringFromTokens(baseToken, quoteToken);

                    content = (
                        <Table isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH>Side</TH>
                                    <TH styles={{ textAlign: 'right' }}>Price ({quoteToken.symbol.toUpperCase()})</TH>
                                    <TH styles={{ textAlign: 'right' }}>Amount ({baseToken.symbol.toUpperCase()})</TH>
                                    <TH styles={{ textAlign: 'right' }}>Total ({quoteToken.symbol.toUpperCase()})</TH>
                                    <TH styles={{ textAlign: 'right' }}>Age</TH>
                                </TR>
                            </THead>
                            <tbody>
                                {marketFills[market].map((marketFill, index) => fillToRow(marketFill, index))}
                            </tbody>
                        </Table>
                    );
                }
                break;
            }
        }

        return <MarketTradesList title="Market History">{content}</MarketTradesList>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        orders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        marketFills: getMarketFills(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketFillsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketFills);

export { MarketFills, MarketFillsContainer };
