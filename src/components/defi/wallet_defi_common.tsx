import React, { useState, useEffect } from 'react';

import styled from "styled-components";
import { themeDimensions } from "../../themes/commons";
import { CardBase } from '../common/card_base';
import { useQuery } from '@apollo/react-hooks';
import { AaveReserveGQLResponse } from '../../util/aave/types';
import { GET_AAVE_RESERVES } from '../../services/aave/gql';
import { useDispatch, useSelector } from 'react-redux';
import { setAaveReservesGQLResponse, initAave } from '../../store/actions';
import { getEthAccount } from '../../store/selectors';
import { getAaveGraphClient } from '../../services/aave/aave';
import { WalletDefiLendingBalances } from './wallet_defi_lending_balances';

const Content = styled.div`
display: flex;
flex-direction: column;
padding: 10px;
`;

const TabsContainer = styled.div`
align-items: center;
display: flex;
justify-content: space-between;
`;

const TabButton = styled.div<{ isSelected: boolean; type: DefiType }>`
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
            ? props.type === DefiType.Deposit
                ? props.theme.componentsTheme.textColorCommon
                : props.theme.componentsTheme.darkGray
            : props.theme.componentsTheme.textLight};
cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
display: flex;
font-weight: 600;
height: 35px;
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
const WalletDefiCommonWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
`;

enum DefiType {
    Deposit,
    Borrow,
}

export const WalletDefiCommon = () => {

    const { loading, error, data } = useQuery<{reserves: AaveReserveGQLResponse[]}>(GET_AAVE_RESERVES, {
        client: getAaveGraphClient(),
    });
    const dispatch = useDispatch();
    const ethAccount = useSelector(getEthAccount);

    useEffect(() => {
        if (!loading && !error && data) {
            console.log(data.reserves);
            dispatch(setAaveReservesGQLResponse(data.reserves));
            dispatch(initAave(data.reserves));
        }

    }, [loading, data]
    )

    const [tab, setTab] = useState(DefiType.Deposit)

    return (
        <>
            <WalletDefiCommonWrapper>
                <TabsContainer>
                    <TabButton
                        isSelected={tab === DefiType.Deposit}
                        onClick={() => setTab(DefiType.Deposit)}
                        type={DefiType.Deposit}
                    >
                        Deposit
                    </TabButton>
                    <TabButton
                        isSelected={tab === DefiType.Borrow}
                        onClick={() => setTab(DefiType.Borrow)}
                        type={DefiType.Borrow}
                    >
                        Borrow
                    </TabButton>
                </TabsContainer>
                <Content>
                    {
                        tab === DefiType.Deposit && <WalletDefiLendingBalances/>
                    }
                    {
                        tab === DefiType.Borrow && (` this is borrow`)
                    }

                </Content>
            </WalletDefiCommonWrapper>
        </>)

}