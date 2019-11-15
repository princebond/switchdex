import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeMarket, goToHome } from '../../../store/actions';
import {  getWeb3State } from '../../../store/selectors';
import { CurrencyPair, StoreState,  Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';

import { WizardFormWithTheme } from './wizard_form';

const WizardCard = styled(Card)`
    max-height: 320px;
    overflow: auto;
`;

interface StateProps {
    web3State?: Web3State;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

class Wizard extends React.Component<Props> {
    public render = () => {
        const { web3State } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContent alignAbsoluteCenter={true} text="Loading Wallet" />;
                break;
            }
            default: {
                if(web3State !== Web3State.Error ) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else {
                    content = <EmptyContent alignAbsoluteCenter={true} text="Error Loading the wallet" />;
                }
                content = <WizardFormWithTheme />;
                break;
            }
        }

        return <WizardCard title="DEX Wizard">{content}</WizardCard>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
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
