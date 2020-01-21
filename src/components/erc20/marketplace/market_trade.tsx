import { BigNumber } from '@0x/utils';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { IS_ORDER_LIMIT_MATCHING, ZERO } from '../../../common/constants';
import {
    initWallet,
    startBuySellLimitMatchingSteps,
    startBuySellLimitSteps,
    startBuySellMarketSteps,
} from '../../../store/actions';
import { fetchTakerAndMakerFee } from '../../../store/relayer/actions';
import {
    getBaseTokenBalance,
    getCurrencyPair,
    getOrderPriceSelected,
    getQuoteTokenBalance,
    getTotalEthBalance,
    getWeb3State,
} from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { getKnownTokens, isWeth } from '../../../util/known_tokens';
import { formatTokenSymbol, tokenAmountInUnits, unitsInTokenAmount } from '../../../util/tokens';
import {
    ButtonIcons,
    ButtonVariant,
    CurrencyPair,
    OrderFeeData,
    OrderSide,
    OrderType,
    StoreState,
    TokenBalance,
    Web3State,
} from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
import { CardBase } from '../../common/card_base';
import { CardTabSelector } from '../../common/card_tab_selector';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';

import { OrderDetailsContainer } from './order_details';

interface StateProps {
    web3State: Web3State;
    currencyPair: CurrencyPair;
    orderPriceSelected: BigNumber | null;
    baseTokenBalance: TokenBalance | null;
    quoteTokenBalance: TokenBalance | null;
    totalEthBalance: BigNumber;
}

interface DispatchProps {
    onSubmitLimitOrder: (
        amount: BigNumber,
        price: BigNumber,
        side: OrderSide,
        orderFeeData: OrderFeeData,
    ) => Promise<any>;
    onSubmitLimitOrderMatching: (
        amount: BigNumber,
        price: BigNumber,
        side: OrderSide,
        orderFeeData: OrderFeeData,
    ) => Promise<any>;
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, orderFeeData: OrderFeeData) => Promise<any>;
    onConnectWallet: () => any;
    onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<OrderFeeData>;
}

type Props = StateProps & DispatchProps;

interface State {
    makerAmount: BigNumber | null;
    orderType: OrderType;
    price: BigNumber | null;
    tab: OrderSide;
    error: {
        btnMsg: string | null;
        cardMsg: string | null;
    };
}

const BuySellWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px ${themeDimensions.horizontalPadding};
`;

const TabsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TabButton = styled.div<{ isSelected: boolean; side: OrderSide }>`
    align-items: center;
    background-color: ${props =>
        props.isSelected ? 'transparent' : props.theme.componentsTheme.inactiveTabBackgroundColor};
    border-bottom-color: ${props => (props.isSelected ? 'transparent' : props.theme.componentsTheme.cardBorderColor)};
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
    border-right-style: solid;
    border-right-width: 1px;
    color: ${props =>
        props.isSelected
            ? props.side === OrderSide.Buy
                ? props.theme.componentsTheme.green
                : props.theme.componentsTheme.red
            : props.theme.componentsTheme.textLight};
    cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
    display: flex;
    font-weight: 600;
    height: 47px;
    justify-content: center;
    width: 50%;

    &:first-child {
        border-top-left-radius: ${themeDimensions.borderRadius};
    }

    &:last-child {
        border-left-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
        border-left-style: solid;
        border-left-width: 1px;
        border-right: none;
        border-top-right-radius: ${themeDimensions.borderRadius};
    }
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const LabelAvailableContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const LabelAvaible = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    margin: 0;
`;

const MinLabel = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const InnerTabs = styled(CardTabSelector)`
    font-size: 14px;
`;

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    position: relative;
`;

const FieldAmountContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 5px;
    position: relative;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
    position: absolute;
    width: 100%;
    z-index: 1;
`;

const TokenContainer = styled.div`
    display: flex;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 12;
`;

const TokenText = styled.span`
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    text-align: right;
`;

const BigInputNumberTokenLabel = (props: { tokenSymbol: string }) => (
    <TokenContainer>
        <TokenText>{formatTokenSymbol(props.tokenSymbol)}</TokenText>
    </TokenContainer>
);

const TIMEOUT_BTN_ERROR = 2000;
const TIMEOUT_CARD_ERROR = 4000;

const  MarketTrade = (props:Props) =>  {
    /*public state: State = {
        makerAmount: null,
        price: null,
        orderType: OrderType.Market,
        tab: OrderSide.Buy,
        error: {
            btnMsg: null,
            cardMsg: null,
        },
    };*/
        const [tabState, setTabState] = useState(OrderSide.Buy);
        const [errorState, setErrorState] = useState<{btnMsg: null | string; cardMsg: null | string}>({
            btnMsg: null,
            cardMsg: null,
        });
        const [priceState, setPriceState] = useState(new BigNumber(0));
        const [makerAmountState, setMakerAmountState] = useState(new BigNumber(0));
        const { currencyPair, web3State } = props;
       //const { makerAmount, price, tab, orderType, error } = this.state;

        
        const decimals = getKnownTokens().getTokenBySymbol(currencyPair.base).decimals;
        // Configs
        const pricePrecision = currencyPair.config.pricePrecision;
        const minAmount = currencyPair.config.minAmount;
        const minAmountUnits = unitsInTokenAmount(String(currencyPair.config.minAmount), decimals);

        const basePrecision = currencyPair.config.basePrecision;
        const stepAmount = new BigNumber(1).div(new BigNumber(10).pow(basePrecision));
        const stepAmountUnits = unitsInTokenAmount(String(stepAmount), decimals);

        const amount = makerAmountState || minAmountUnits;
        const isMakerAmountEmpty = amount === null || amount.isZero();
        const isMakerAmountMin = amount === null || amount.isLessThan(minAmountUnits);

        const isPriceEmpty = priceState === null || priceState.isZero();
        const isPriceMin =
        priceState === null || priceState.isLessThan(new BigNumber(1).div(new BigNumber(10).pow(pricePrecision)));
        

        const isOrderTypeMarketIsEmpty =  (isMakerAmountEmpty || isMakerAmountMin);
        const baseSymbol = formatTokenSymbol(currencyPair.base);
        const btnPrefix = tabState === OrderSide.Buy ? 'Buy ' : 'Sell ';
        const btnText = errorState && errorState.btnMsg ? 'Error' : btnPrefix + baseSymbol;
        const _reset = () => {
            setMakerAmountState(new BigNumber(0));
            setPriceState(new BigNumber(0));
        };
        const changeTab = (tab: OrderSide) => () => setTabState(tab);

        const onSubmit = async () => {
            const { currencyPair } = props;
            const minAmount = currencyPair.config.minAmount;
            const decimals = getKnownTokens().getTokenBySymbol(currencyPair.base).decimals;
            const minAmountUnits = unitsInTokenAmount(String(minAmount), decimals);
    
            const orderSide = tabState;
            const makerAmount = makerAmountState || minAmountUnits;
            const price = priceState;
    
            const orderFeeData = await props.onFetchTakerAndMakerFee(makerAmount, price, tabState);

                try {
                    await props.onSubmitMarketOrder(makerAmount, orderSide, orderFeeData);
                } catch (error) {
                    setErrorState({
                        btnMsg: 'Error',
                        cardMsg: error.message,
                    });
                    setTimeout(() => {
                        setErrorState({
                                ...errorState,
                                btnMsg: null,
                            });
                       
                    }, TIMEOUT_BTN_ERROR);

                    setTimeout(() => {
                       setErrorState({
                                ...errorState,
                                cardMsg: null,
                            });
                    }, TIMEOUT_CARD_ERROR);
                   
                }
            
            _reset();
        };
        const onUpdateMakerAmount = (newValue: BigNumber) => setMakerAmountState(newValue);
        const getAmountAvailableLabel = () => {
            const { baseTokenBalance, quoteTokenBalance, totalEthBalance } = props;
            if (tabState === OrderSide.Sell) {
                if (baseTokenBalance) {
                    const tokenBalanceAmount = isWeth(baseTokenBalance.token.symbol)
                        ? totalEthBalance
                        : baseTokenBalance.balance;
                    const baseBalanceString = tokenAmountInUnits(
                        tokenBalanceAmount,
                        baseTokenBalance.token.decimals,
                        baseTokenBalance.token.displayDecimals,
                    );
                    const symbol = formatTokenSymbol(baseTokenBalance.token.symbol);
                    return `Available: ${baseBalanceString}  ${symbol}`;
                } else {
                    return null;
                }
            } else {
                if (quoteTokenBalance) {
                    const tokenBalanceAmount = isWeth(quoteTokenBalance.token.symbol)
                        ? totalEthBalance
                        : quoteTokenBalance.balance;
                    const quoteBalanceString = tokenAmountInUnits(
                        tokenBalanceAmount,
                        quoteTokenBalance.token.decimals,
                        quoteTokenBalance.token.displayDecimals,
                    );
                    const symbol = formatTokenSymbol(quoteTokenBalance.token.symbol);
                    return `Available: ${quoteBalanceString}  ${symbol}`;
                } else {
                    return null;
                }
            }
        };
        const onUpdatePrice = (price: BigNumber) => setPriceState(price);

        return (
            <>
                <BuySellWrapper>
                    <TabsContainer>
                        <TabButton
                            isSelected={tabState === OrderSide.Buy}
                            onClick={changeTab(OrderSide.Buy)}
                            side={OrderSide.Buy}
                        >
                            Buy
                        </TabButton>
                        <TabButton
                            isSelected={tabState === OrderSide.Sell}
                            onClick={changeTab(OrderSide.Sell)}
                            side={OrderSide.Sell}
                        >
                            Sell
                        </TabButton>
                    </TabsContainer>
                    <Content>
                        <LabelContainer>
                            <Label>
                                Amount <MinLabel>(Min: {minAmount})</MinLabel>
                            </Label>
                        </LabelContainer>
                        <FieldAmountContainer>
                            <BigInputNumberStyled
                                decimals={decimals}
                                min={ZERO}
                                onChange={onUpdateMakerAmount}
                                value={amount}
                                step={stepAmountUnits}
                                placeholder={new BigNumber(minAmount).toString()}
                                valueFixedDecimals={basePrecision}
                            />
                            <BigInputNumberTokenLabel tokenSymbol={currencyPair.base} />
                        </FieldAmountContainer>
                        <LabelAvailableContainer>
                            <LabelAvaible>{getAmountAvailableLabel()}</LabelAvaible>
                        </LabelAvailableContainer>
                        <OrderDetailsContainer
                            orderType={OrderType.Market}
                            orderSide={tabState}
                            tokenAmount={amount}
                            tokenPrice={priceState}
                            currencyPair={currencyPair}
                        />
                        <Button
                            disabled={
                                web3State !== Web3State.Done  || isOrderTypeMarketIsEmpty
                            }
                            icon={ errorState.btnMsg ? ButtonIcons.Warning : undefined}
                            onClick={onSubmit}
                            variant={
                                errorState.btnMsg
                                    ? ButtonVariant.Error
                                    : tabState === OrderSide.Buy
                                    ? ButtonVariant.Buy
                                    : ButtonVariant.Sell
                            }
                        >
                            {btnText}
                        </Button>
                    </Content>
                </BuySellWrapper>
                { errorState.cardMsg ? (
                    <ErrorCard fontSize={FontSize.Large} text={errorState.cardMsg} icon={ErrorIcons.Sad} />
                ) : null}
            </>
        );
};

    

    

   


const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        orderPriceSelected: getOrderPriceSelected(state),
        quoteTokenBalance: getQuoteTokenBalance(state),
        baseTokenBalance: getBaseTokenBalance(state),
        totalEthBalance: getTotalEthBalance(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSubmitLimitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide, orderFeeData: OrderFeeData) =>
            dispatch(startBuySellLimitSteps(amount, price, side, orderFeeData)),
        onSubmitLimitOrderMatching: (
            amount: BigNumber,
            price: BigNumber,
            side: OrderSide,
            orderFeeData: OrderFeeData,
        ) => dispatch(startBuySellLimitMatchingSteps(amount, price, side, orderFeeData)),
        onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, orderFeeData: OrderFeeData) =>
            dispatch(startBuySellMarketSteps(amount, side, orderFeeData)),
        onConnectWallet: () => dispatch(initWallet()),
        onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(fetchTakerAndMakerFee(amount, price, side)),
    };
};

const MarketTradeContainer = connect(mapStateToProps, mapDispatchToProps)(MarketTrade);

export { MarketTrade, MarketTradeContainer };
