import { BigNumber } from '@0x/utils';
import React, { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import {  ZERO } from '../../../common/constants';
import {

    startBuySellMarketSteps,
    calculateSwapQuote,
} from '../../../store/actions';
import { fetchTakerAndMakerFee } from '../../../store/relayer/actions';
import {
    getCurrencyPair,
    getOrderPriceSelected,
    getTotalEthBalance,
    getWeb3State,
    getSwapQuote,
    getSwapQuoteTokenBalance,
    getSwapBaseTokenBalance,
    getSwapQuoteToken,
    getSwapBaseToken,
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
    StoreState,
    TokenBalance,
    Web3State,
} from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
import { CardBase } from '../../common/card_base';
import { CardTabSelector } from '../../common/card_tab_selector';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';

import { MarketTradeDetailsContainer } from './market_trade_details';
import { CalculateSwapQuoteParams } from '../../../util/types/swap';

interface StateProps {
    web3State: Web3State;
    currencyPair: CurrencyPair;
    orderPriceSelected: BigNumber | null;
    baseTokenBalance: TokenBalance | null;
    quoteTokenBalance: TokenBalance | null;
    totalEthBalance: BigNumber;
}

interface DispatchProps {
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, orderFeeData: OrderFeeData) => Promise<any>;
    onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<OrderFeeData>;
}

type Props = StateProps & DispatchProps;



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
   
        const [tabState, setTabState] = useState(OrderSide.Buy);
        const [errorState, setErrorState] = useState<{btnMsg: null | string; cardMsg: null | string}>({
            btnMsg: null,
            cardMsg: null,
        });
        const [priceState, setPriceState] = useState(new BigNumber(0));
        const [makerAmountState, setMakerAmountState] = useState(new BigNumber(0));
        const {  web3State, quoteTokenBalance, baseTokenBalance } = props;
        const swapQuote = useSelector(getSwapQuote);
        const quoteToken = useSelector(getSwapQuoteToken);
        const baseToken  = useSelector(getSwapBaseToken);
        const dispatch = useDispatch();
        const decimals = baseToken.decimals;
        
        const stepAmount = new BigNumber(1).div(new BigNumber(10).pow(8));
        const stepAmountUnits = unitsInTokenAmount(String(stepAmount), decimals);
        const amount = makerAmountState;
        const isMakerAmountEmpty = amount === null || amount.isZero();
        let quoteTokenAmount = ZERO;
        const isSell = tabState === OrderSide.Sell;
        if(swapQuote){
            quoteTokenAmount = isSell ? swapQuote.bestCaseQuoteInfo.makerAssetAmount : swapQuote.bestCaseQuoteInfo.takerAssetAmount;
        }
        
        const isOrderTypeMarketIsEmpty =  (isMakerAmountEmpty);
        const baseSymbol = formatTokenSymbol(baseToken.symbol);
        const btnPrefix = tabState === OrderSide.Buy ? 'Buy ' : 'Sell ';
        const btnText = errorState && errorState.btnMsg ? 'Error' : btnPrefix + baseSymbol;
        const _reset = () => {
            setMakerAmountState(new BigNumber(0));
            setPriceState(new BigNumber(0));
        };
        const onCalculateSwapQuote = (value: BigNumber, side: OrderSide) => {
            const isSell = tabState === OrderSide.Sell;
            const isETHSell = isSell && isWeth(quoteToken.symbol); 
            const params: CalculateSwapQuoteParams = {
                buyTokenAddress: isSell ? quoteToken.address : baseToken.address,
                sellTokenAddress: isSell ? baseToken.address : quoteToken.address,
                buyAmount: isSell ? undefined : value, 
                sellAmount:isSell ?  value: undefined, 
                from: undefined,
                isETHSell: isETHSell,

            }
            dispatch(calculateSwapQuote(params))
        }



        const changeTab = (tab: OrderSide) => () => {
            setTabState(tab)
            onCalculateSwapQuote(makerAmountState, tab);
        
        };

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
        const onUpdateMakerAmount = (newValue: BigNumber) => {
            setMakerAmountState(newValue);
            onCalculateSwapQuote(newValue, tabState);
        }


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
                                Amount
                            </Label>
                        </LabelContainer>
                        <FieldAmountContainer>
                            <BigInputNumberStyled
                                decimals={decimals}
                                min={ZERO}
                                onChange={onUpdateMakerAmount}
                                value={amount}
                                step={stepAmountUnits}
                                placeholder={new BigNumber(0).toString()}
                                valueFixedDecimals={8}
                            />
                            <BigInputNumberTokenLabel tokenSymbol={baseToken.symbol} />
                        </FieldAmountContainer>
                        <LabelAvailableContainer>
                            <LabelAvaible>{getAmountAvailableLabel()}</LabelAvaible>
                        </LabelAvailableContainer>
                        <MarketTradeDetailsContainer
                            orderSide={tabState}
                            tokenAmount={amount}
                            tokenPrice={priceState}
                            baseToken={baseToken}
                            quoteToken={quoteToken}
                            quote={swapQuote}
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
        quoteTokenBalance: getSwapQuoteTokenBalance(state),
        baseTokenBalance: getSwapBaseTokenBalance(state),
        totalEthBalance: getTotalEthBalance(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, orderFeeData: OrderFeeData) =>
            dispatch(startBuySellMarketSteps(amount, side, orderFeeData)),
        onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(fetchTakerAndMakerFee(amount, price, side)),
    };
};

const MarketTradeContainer = connect(mapStateToProps, mapDispatchToProps)(MarketTrade);

export { MarketTrade, MarketTradeContainer };
