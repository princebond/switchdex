import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getFills, getQuoteToken, getUserOrders, getWeb3State } from '../../../store/selectors';
import { CurrencyPair, Fill, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';

const WizardCard = styled(Card)`
    max-height: 320px;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    quoteToken: Token | null;
    web3State?: Web3State;
    fills: Fill[];
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

class Wizard extends React.Component<Props> {
    public render = () => {
        const { fills, baseToken, quoteToken, web3State } = this.props;
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
                } else if (!fills.length || !baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                } else {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                }
                break;
            }
        }

        return <WizardCard title="DEX Wizard">{content}</WizardCard>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        orders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        fills: getFills(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const WizardContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Wizard);

export { Wizard, WizardContainer };
